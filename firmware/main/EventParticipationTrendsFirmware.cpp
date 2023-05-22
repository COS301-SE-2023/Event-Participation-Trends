#include <stdio.h>
#include "ota.h"
#include "mqtt.h"
#include "utils.h"


#include "esp_wifi.h"
#include "esp_mac.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_mesh.h"
#include "esp_mesh_internal.h"
#include "nvs_flash.h"

void app_main(void)
{
    // This is the main entry point of the firmware.
    /*
        The following will happen in this function:
            - Try to perform OTA update to OTA-specific Wi-Fi network
                - FAIL: Return and we can continue with the rest of the code.
                - SUCCESS:
                    - UPDATED: OTA will automatically cause the device to reboot.
                    - NOT UPDATED: OTA will return and we can continue with the rest of the code.
            - IF MESH_BYPASS
                - Connect to CONFIG_MESH_ROUTER_SSID and CONFIG_MESH_ROUTER_PASSWORD
                - Automatic Reconnect In event_handler.
                - Start a task that will send an MQTT message every 5 seconds with all detected Bluetooth Devices.
            - ELSE
                - Initialize the mesh network
                    - If we are the root node:
                        - Initialize the mesh network.
                        - Wait for the client to be initialized in separate task.
                - Initialize MQTT when we receive an ip.
    */
#ifdef CONFIG_OTA_ENABLE
    ESP_LOGI("OTA", "Starting OTA");
    perform_ota_advanced();
    ESP_LOGI("OTA", "Finished OTA");
#endif
#ifndef CONFIG_MESH_ENABLE
    wifi_config_t wifi_config = {
        .sta = {
            .ssid = CONFIG_MESH_ROUTER_SSID,
            .password = CONFIG_MESH_ROUTER_PASSWD,
        },
    };
    easy_wifi_connect(wifi_config, -1, true, true);
    INITIALIZE_MQTT(true);
    mqtt_publish_debug("I have connected successfully");
    while (true)
    {
        ESP_LOGW("MQTT", "Free heap size: %d", (int)esp_get_free_heap_size());
        mqtt_publish_debug("This is a debug message test");
        vTaskDelay(5000 / portTICK_PERIOD_MS);
    }
#else
    // MESH && Task that
    // - Sends values to root if it isn't the root
    // - That publishes received messages to MQTT if it is the root node
#endif
}
