#include "utils.h"

esp_netif_t *net = NULL;
esp_event_handler_instance_t instance_any_id;
bool retry_exceeded = false;
bool got_ip = false;
bool connected = false;
int max_retry = -1;
int retry = 0;
const char *TAG = "UTILS_H";

static void event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_DISCONNECTED)
    {
        if (max_retry == -1)
        {
            esp_wifi_connect();
            retry++;
            ESP_LOGI(TAG, "AP disconnected, attempting to reconnect (attempt %d/%d)", retry, max_retry);
        }
        else if (retry < max_retry)
        {
            esp_wifi_connect();
            retry++;
            ESP_LOGI(TAG, "AP disconnected, attempting to reconnect (attempt %d/%d)", retry, max_retry);
        }
        else
        {
            ESP_LOGI(TAG, "Failed to connect to AP, terminating OTA update process");
            retry_exceeded = true;
        }
    }
    else if (event_base == WIFI_EVENT && event_id == WIFI_EVENT_STA_CONNECTED)
    {
        connected = true;
        retry = 0;
    }
}

static void ip_event_handler(void *arg, esp_event_base_t event_base, int32_t event_id, void *event_data)
{
    got_ip = true;
}

void easy_wifi_connect(wifi_config_t wifi_config, int max_retry, bool wait_for_ip, bool wait_for_connect)
{
    max_retry = max_retry;
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
    ESP_ERROR_CHECK(esp_event_handler_instance_register(WIFI_EVENT, ESP_EVENT_ANY_ID, &event_handler, NULL, &instance_any_id));
    ESP_ERROR_CHECK(esp_event_handler_register(IP_EVENT, IP_EVENT_STA_GOT_IP, &ip_event_handler, NULL));
    ESP_ERROR_CHECK(esp_wifi_set_mode(WIFI_MODE_STA));
    ESP_ERROR_CHECK(esp_wifi_set_config(WIFI_IF_STA, &wifi_config));
    ESP_ERROR_CHECK(esp_wifi_start());
    ESP_ERROR_CHECK(esp_wifi_disconnect());
    ESP_ERROR_CHECK(esp_wifi_connect());
    while((!connected && wait_for_connect) || (!got_ip && wait_for_ip))
    {
        vTaskDelay(200 / portTICK_PERIOD_MS);
    }
}

void easy_wifi_disconnect()
{
    esp_event_handler_instance_unregister(WIFI_EVENT, ESP_EVENT_ANY_ID, instance_any_id);
    esp_wifi_disconnect();
    esp_wifi_stop();
    esp_wifi_deinit();
    esp_netif_destroy_default_wifi(net);
    esp_event_loop_delete_default();
    esp_netif_deinit();
    nvs_flash_deinit();
}

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