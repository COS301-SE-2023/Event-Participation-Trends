#ifndef MQTT_H
#define MQTT_H

#include <string.h>
#include "esp_wifi.h"
#include "esp_system.h"
#include "esp_crt_bundle.h"
#include "esp_log.h"
#include "mqtt_client.h"
#include "esp_mac.h"

esp_mqtt_client_handle_t INITIALIZE_MQTT(bool wait_for_connection);
esp_err_t mqtt_publish_debug(const char* data);
esp_err_t mqtt_publish_sensor(const char* data);


#endif