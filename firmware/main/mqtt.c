#include "mqtt.h"
#include "utils.h"

const char *MQTT_TAG = "MQTT_H";
static esp_mqtt_client_handle_t mqtt_client = NULL;
bool mqtt_client_connected = false;
char mac_address_str[18];

esp_err_t mqtt_publish_debug(const char *data)
{
    if (mqtt_client != NULL && mqtt_client_connected)
    {
        esp_mqtt_client_publish(mqtt_client, CONFIG_MQTT_TOPIC_DEBUG, data, strlen(data), 0, 0);
        return ESP_OK;
    }
    printf("Debug message not published, client not connected...");
    return ESP_FAIL;
}

esp_err_t mqtt_publish_sensor(const char *data)
{
    if (mqtt_client != NULL && mqtt_client_connected)
    {
        esp_mqtt_client_publish(mqtt_client, CONFIG_MQTT_TOPIC_DEVICES, data, strlen(data), 0, 0);
        return ESP_OK;
    }
    printf("Device message not published, client not connected...");
    return ESP_FAIL;
}

static void mqtt_event_handler(void *args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    esp_mqtt_event_handle_t event = event_data;
    char *topic_buffer = NULL;
    char *data_buffer = NULL;
    switch (event->event_id)
    {
    case MQTT_EVENT_CONNECTED:
        ESP_LOGI(MQTT_TAG, "MQTT Client has connected successfully!");
        esp_mqtt_client_publish(mqtt_client, CONFIG_MQTT_TOPIC_CONNECTED, mac_address_str, strlen(mac_address_str), 0, 0);
        mqtt_client_connected = true;
        break;
    case MQTT_EVENT_DISCONNECTED:
        ESP_LOGW(MQTT_TAG, "MQTT Client has disconnected... Trying to reconnect");
        esp_mqtt_client_reconnect(mqtt_client);
        mqtt_client_connected = false;
        break;
    case MQTT_EVENT_ERROR:
        ESP_LOGE(MQTT_TAG, "MQTT Client has encountered an Error...");
        break;
    case MQTT_EVENT_DATA:
        ESP_LOGI(MQTT_TAG, "MQTT Client has received data");
        topic_buffer = calloc(event->topic_len + 1, sizeof(char));
        data_buffer = calloc(event->data_len + 1, sizeof(char));
        memcpy(topic_buffer, event->topic, event->topic_len);
        memcpy(data_buffer, event->data, event->data_len);
        ESP_LOGI(MQTT_TAG, "Topic: %s", topic_buffer);
        ESP_LOGI(MQTT_TAG, "Data: %s", data_buffer);
        if(strcmp(topic_buffer, "/reset") == 0){
            ESP_LOGI(MQTT_TAG, "Resetting device...");
            esp_restart();
        }
        free(topic_buffer);
        free(data_buffer);
        break;
    default:
        ESP_LOGW(MQTT_TAG, "Other event id:%d", event->event_id);
        break;
    }
}

esp_mqtt_client_handle_t INITIALIZE_MQTT(bool wait_for_connection)
{
    if (mqtt_client)
        return mqtt_client;
    while (!wifi_is_connected())
    {
        ESP_LOGI(MQTT_TAG, "Waiting for WiFi connection...");
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
    uint8_t mac_address[6];
    esp_efuse_mac_get_default(mac_address);
    snprintf(mac_address_str, 18, "%02X:%02X:%02X:%02X:%02X:%02X", mac_address[0], mac_address[1], mac_address[2], mac_address[3], mac_address[4], mac_address[5]);

    const esp_mqtt_client_config_t mqtt_cfg = {
        .broker.address.uri = CONFIG_MQTT_BROKER_URL,
        .broker.verification.crt_bundle_attach = esp_crt_bundle_attach,
        .credentials.username = CONFIG_MQTT_BROKER_USERNAME,
        .credentials.authentication.password = CONFIG_MQTT_BROKER_PASSWD,
        .session.last_will.topic = CONFIG_MQTT_TOPIC_LWT,
        .session.last_will.msg = (char *)mac_address_str,
        .session.last_will.msg_len = 0,
        .session.last_will.qos = 0,
        .session.last_will.retain = 0,
        .session.disable_keepalive = false,
        .session.keepalive = 10};

    mqtt_client = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_register_event(mqtt_client, ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);
    esp_mqtt_client_start(mqtt_client);
    while (!mqtt_client_connected)
    {
        ESP_LOGI(MQTT_TAG, "Waiting for MQTT connection...");
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
    esp_mqtt_client_subscribe(mqtt_client, "/reset", 0);
    return mqtt_client;
}