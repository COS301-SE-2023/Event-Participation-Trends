#include "ota.h"
#include "mqtt.h"
#include "utils.h"
#include "esp_mac.h"
#include "esp_mesh.h"
#include "esp_mesh_internal.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "lwip/err.h"
#include "lwip/sys.h"
#include "esp_timer.h"
#include "esp_system.h"
#include "driver/gpio.h"
#include "esp_wifi.h"

#include <stdio.h>
#include <string>
#include <vector>
#include <unordered_map>
#include <mutex>

typedef struct {
    int rssi;
    uint8_t mac[6];
} newPacket;

#define QUEUE_SIZE 1000
QueueHandle_t packetQueue;

std::mutex macs_mutex;
std::unordered_map<std::string, int> macs;
std::string global_mac_addr = "";
std::string data = "";

static void flashLed(){
    bool ledState = false;
    ledState = !ledState;
    gpio_set_level(GPIO_NUM_10, ledState);
    vTaskDelay(50 / portTICK_PERIOD_MS);
    ledState = !ledState;
    gpio_set_level(GPIO_NUM_10, ledState);
    vTaskDelay(70 / portTICK_PERIOD_MS);
    ledState = !ledState;
    gpio_set_level(GPIO_NUM_10, ledState);
    vTaskDelay(50 / portTICK_PERIOD_MS);
    ledState = !ledState;
    gpio_set_level(GPIO_NUM_10, ledState);
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
    macs.clear();
    macs_mutex.unlock();
    esp_wifi_set_promiscuous(false);
    mqtt_publish_sensor(data.c_str());
    flashLed();
    esp_wifi_set_promiscuous(true);
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

    newPacket packetToSend;
    packetToSend.rssi = rssi;
    for(int i = 0; i < 6; i++){
        packetToSend.mac[i] = mac_addr[i];
    }
    xQueueSend(packetQueue, &packetToSend, portMAX_DELAY);
}

void processPacketTask(void *pvParameters) {
    int packet_counter = 0;
    TickType_t start = xTaskGetTickCount();
    while (1) {
        packet_counter++;
        if(packet_counter % 1000 == 0){
            float avg = (float)packet_counter / ((float)pdTICKS_TO_MS(xTaskGetTickCount() - start)/1000);
            packet_counter = 0;
            start = xTaskGetTickCount();
            ESP_LOGI("COUNTER", "Average packets received %f", avg);
        }
        newPacket receivedPacket;
        int freeHeapSize = (int)esp_get_free_heap_size();
        bool ten_percent_check = esp_get_free_heap_size() > 0.1 * esp_get_minimum_free_heap_size();
        ten_percent_check = ten_percent_check && freeHeapSize > 5000;
        if (xQueueReceive(packetQueue, &receivedPacket, portMAX_DELAY) == pdTRUE && ten_percent_check) {
            char mac_str[18];
            snprintf(mac_str, 18, "%02x:%02x:%02x:%02x:%02x:%02x", receivedPacket.mac[0], receivedPacket.mac[1], receivedPacket.mac[2], receivedPacket.mac[3], receivedPacket.mac[4], receivedPacket.mac[5]);
            macs_mutex.lock();
            // if free heap size under 10% of total heap size, clear the map
            if(macs.find(mac_str) != macs.end()){
                if(macs[mac_str] < receivedPacket.rssi){
                    macs[mac_str] = receivedPacket.rssi;
                }
            }
            else{
                macs.insert({mac_str, receivedPacket.rssi});
            }
            macs_mutex.unlock();
        }
    }
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
                - Start a task that will send an MQTT message every 5 seconds with all detected Wi-Fi Devices.
            - ELSE
                - Initialize the mesh network
                    - If we are the root node:
                        - Initialize the mesh network.
                        - Wait for the client to be initialized in separate task.
                - Initialize MQTT when we receive an ip.
    */
    packetQueue = xQueueCreate(QUEUE_SIZE, sizeof(newPacket));
    xTaskCreate(processPacketTask, "ProcessPacketTask", 4096, NULL, 5, NULL);
    gpio_reset_pin(GPIO_NUM_10);
    gpio_set_direction(GPIO_NUM_10, GPIO_MODE_OUTPUT);
    ESP_LOGI("OTA", "THIS IS VERSION 2.0.0");
    uint8_t mac[6];
    esp_efuse_mac_get_default(mac);
    char mac_str[18];
    snprintf(mac_str, 18, "%02x:%02x:%02x:%02x:%02x:%02x", mac[0], mac[1], mac[2], mac[3], mac[4], mac[5]);
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
