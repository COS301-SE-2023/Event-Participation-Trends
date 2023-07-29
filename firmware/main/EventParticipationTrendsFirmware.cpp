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
#include "esp_timer.h"
#include "esp_system.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"


#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_system.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "lwip/err.h"
#include "lwip/sys.h"
#include "esp_timer.h"
#include "esp_system.h"
#include "driver/gpio.h"
#include "esp_wifi.h"

#include <unordered_map>
#include <string>
#include <vector>
#include <unordered_map>
#include <string>
#include <mutex>

std::mutex macs_mutex;
std::unordered_map<std::string, int> macs;
std::string global_mac_addr = "";
std::string data = "";

static void flashLed(){
    static bool ledState = false;
    ledState = !ledState;
    gpio_set_level(GPIO_NUM_10, ledState);
    vTaskDelay(150 / portTICK_PERIOD_MS);
    ledState = !ledState;
    gpio_set_level(GPIO_NUM_10, ledState);
}

static void SendBufferTask(void*){
    ESP_LOGI("MQTT", "Sending to MQTT");
    // Amount of devices in the map
    int amount = macs.size();
    ESP_LOGI("MQTT", "Amount of devices: %d", amount);
    macs_mutex.lock();
    for(auto device: macs){
        char message[100];
        snprintf(message, sizeof(message), "{\"mac\": \"%s\", \"rssi\": %d}", device.first.c_str(), device.second);
        mqtt_publish_sensor(message);
        ESP_LOGI("MQTT", "Sending: %s", message);
    }
    macs.clear();
    macs_mutex.unlock();
    vTaskDelete(NULL);
}

static void SendBufferAsSingleJsonArray(void*){
    // This will process the files in the buffer and send them as a json object containing an array of devices, along with the mac-address of this esp32
    data = "";
    data += "{\"sensorMac\": \"";
    data += global_mac_addr;
    data += "\", \"devices\": [";
    macs_mutex.lock();
    int amount = macs.size();
    int i = 0;
    for(auto device: macs){
        data += "{\"mac\": \"";
        data += device.first;
        data += "\", \"rssi\": ";
        data += std::to_string(device.second);
        data += "}";
        if(i < amount - 1){
            data += ", ";
        }
        i++;
    }
    data += "]}";
    mqtt_publish_sensor(data.c_str());
    macs.clear();
    macs_mutex.unlock();
    flashLed();
    vTaskDelete(NULL);
}

static void sendToMQTT_WIFI(TimerHandle_t timer){
    xTaskCreate(SendBufferAsSingleJsonArray, "SendBufferAsSingleJsonArray", 4096, NULL, 5, NULL);
}

static void wifi_sniffer_packet_handler(void*buf, wifi_promiscuous_pkt_type_t packet_type){
    wifi_promiscuous_pkt_t *ppkt = (wifi_promiscuous_pkt_t *)buf;
    wifi_pkt_rx_ctrl_t rx_ctrl = ppkt->rx_ctrl;
    int rssi = rx_ctrl.rssi;
    uint8_t *packet = ppkt->payload;
    uint8_t *mac_addr = packet + 10;
    char mac_str[50];
    snprintf(mac_str, sizeof(mac_str), "%02x:%02x:%02x:XY:XY:XY", mac_addr[0], mac_addr[1], mac_addr[2]);
    // snprintf(mac_str, sizeof(mac_str), "%02x:%02x:%02x:%02x:%02x:%02x", mac_addr[0], mac_addr[1], mac_addr[2], mac_addr[3], mac_addr[4], mac_addr[5]);
    macs_mutex.lock();
    if(macs.find(mac_str) != macs.end()){
        // Update if the new rssi is higher than the old one
        if(macs[mac_str] < rssi){
            macs[mac_str] = rssi;
        }
    }
    else{
        macs.insert({mac_str, rssi});
    }
    macs_mutex.unlock();
}

extern "C" void app_main(void)
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
    gpio_reset_pin(GPIO_NUM_10);
    gpio_set_direction(GPIO_NUM_10, GPIO_MODE_OUTPUT);
    ESP_LOGI("OTA", "THIS IS VERSION 2.0.0");
    uint8_t mac[6];
    esp_efuse_mac_get_default(mac);
    char mac_str[18];
    // snprintf(mac_str, 18, "%02x:%02x:%02x:%02x:%02x:%02x", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
    snprintf(mac_str, 18, "%02x:%02x:%02x:XY:XY:XY", mac[0], mac[1], mac[2]);
    global_mac_addr = std::string(mac_str);
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
    esp_wifi_set_promiscuous(true);
    esp_wifi_set_promiscuous_rx_cb(&wifi_sniffer_packet_handler);
    mqtt_publish_debug("I have connected successfully");
    TimerHandle_t timer = xTimerCreate("SendToMQTT", pdMS_TO_TICKS(1000), pdTRUE, 0, sendToMQTT_WIFI);
    xTimerStart(timer, 0);
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
