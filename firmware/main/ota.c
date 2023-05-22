#include "ota.h"
static const char *TAG = "OTA_H";
esp_http_client_handle_t client;
esp_netif_t *net;
int retry = 0;
bool retry_exceeded = false;
bool got_ip = false;

bool wifi_is_connected()
{
    wifi_ap_record_t ap_info;
    if (esp_wifi_sta_get_ap_info(&ap_info) == ESP_OK)
    {
        if (ap_info.rssi > -127 && ap_info.ssid[0] != '\0')
        {
            return true;
        }
    }
    return false;
}

static void event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    #ifdef CONFIG_OTA_ENABLE
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED)
    {
        if (retry < CONFIG_OTA_MAX_RETRY)
        {
            esp_wifi_connect();
            retry++;
            ESP_LOGI(TAG, "AP disconnected, attempting to reconnect (attempt %d/%d)", retry, CONFIG_OTA_MAX_RETRY);
        }
        else
        {
            ESP_LOGI(TAG, "Failed to connect to AP, terminating OTA update process");
            retry_exceeded = true;
        }
    }
    else if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_CONNECTED)
    {
        retry = 0;
    }
    #endif
}

static void ip_event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    got_ip = true;
}

void startWifi()
{
    #ifdef CONFIG_OTA_ENABLE
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
    {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());
    net = esp_netif_create_default_wifi_sta();
    wifi_init_config_t cfg = WIFI_INIT_CONFIG_DEFAULT();
    ESP_ERROR_CHECK(esp_wifi_init(&cfg));
    esp_event_handler_instance_t instance_any_id;
    ESP_ERROR_CHECK(esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &event_handler, NULL, &instance_any_id));
    ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &ip_event_handler, NULL));
    wifi_config_t wifi_config = {
        .sta = {
            .ssid = CONFIG_OTA_ROUTER_SSID,
            .password = CONFIG_OTA_ROUTER_PASSWD,
        },
    };
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());
    ESP_ERROR_CHECK(esp_wifi_disconnect());
    ESP_ERROR_CHECK(esp_wifi_connect());
    #endif
}

void stopWifi()
{
    esp_wifi_disconnect();
    esp_wifi_stop();
    esp_wifi_deinit();
    esp_netif_destroy_default_wifi(net);
    esp_event_loop_delete_default();
    esp_netif_deinit();
    nvs_flash_deinit();
}

void perform_ota_advanced()
{
    #ifdef CONFIG_OTA_ENABLE
    startWifi();
    while (!wifi_is_connected())
    {
        if (retry_exceeded)
            return;
        ESP_LOGW(TAG, "Waiting for WiFi connection...");
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
    int ip_wait = 5;
    while(!got_ip){
        vTaskDelay(1000);
        ip_wait--;
        if(ip_wait == 0)
            return;
    }
    esp_err_t ota_finish_err = ESP_OK;
    esp_http_client_config_t config = {
        .url = CONFIG_OTA_SERVER_URL,
        .crt_bundle_attach = esp_crt_bundle_attach,
        .keep_alive_enable = true,
    };
    esp_https_ota_config_t ota_config = {
        .http_config = &config,
    };
    esp_https_ota_handle_t https_ota_handle = NULL;
    esp_err_t err = esp_https_ota_begin(&ota_config, &https_ota_handle);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "esp_https_ota_begin failed (%s)", esp_err_to_name(err));
        esp_https_ota_finish(https_ota_handle);
        stopWifi();
        return;
    }
    esp_app_desc_t app_desc;
    err = esp_https_ota_get_img_desc(https_ota_handle, &app_desc);
    if (err != ESP_OK)
    {
        ESP_LOGE(TAG, "esp_https_ota_get_img_desc failed (%s)", esp_err_to_name(err));
        esp_https_ota_abort(https_ota_handle);
        stopWifi();
        return;
    }
    const esp_partition_t *running = esp_ota_get_running_partition();
    esp_app_desc_t running_app_desc;
    if (esp_ota_get_partition_description(running, &running_app_desc) == ESP_OK)
    {
        ESP_LOGI(TAG, "Running firmware version: %s", running_app_desc.version);
    }
    else
    {
        ESP_LOGE(TAG, "esp_ota_get_partition_description failed");
        esp_https_ota_abort(https_ota_handle);
        stopWifi();
        return;
    }
    if (strcmp(running_app_desc.version, app_desc.version) == 0)
    {
        ESP_LOGW(TAG, "New firmware version is the same as the running version");
        esp_https_ota_abort(https_ota_handle);
        stopWifi();
        return;
    }
    while (1)
    {
        err = esp_https_ota_perform(https_ota_handle);
        if (err != ESP_ERR_HTTPS_OTA_IN_PROGRESS)
        {
            break;
        }
        ESP_LOGI(TAG, "Image bytes read: %d", esp_https_ota_get_image_len_read(https_ota_handle));
    }
    if (!esp_https_ota_is_complete_data_received(https_ota_handle))
    {
        ESP_LOGE(TAG, "esp_https_ota_perform failed (%s)", esp_err_to_name(err));
        esp_https_ota_abort(https_ota_handle);
        stopWifi();
        return;
    }
    else
    {
        ota_finish_err = esp_https_ota_finish(https_ota_handle);
        if (ota_finish_err == ESP_OK && err == ESP_OK)
        {
            ESP_LOGI(TAG, "Firmware upgrade successful, rebooting...");
            vTaskDelay(800 / portTICK_PERIOD_MS);
            esp_restart();
        }
        else
        {
            ESP_LOGE(TAG, "Firmware upgrade failed");
            if (ota_finish_err == ESP_ERR_OTA_VALIDATE_FAILED)
            {
                ESP_LOGE(TAG, "Image validation failed, image is corrupted");
            }
            ESP_LOGE(TAG, "ESP_HTTPS_OTA upgrade failed 0x%x", ota_finish_err);
            esp_https_ota_abort(https_ota_handle);
            stopWifi();
        }
    }
    #endif
}