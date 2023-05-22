#ifndef UTILS_H
#define UTILS_H

#include <esp_http_client.h>
#include <esp_https_ota.h>
#include <esp_ota_ops.h>
#include "esp_log.h"
#include "esp_tls.h"
#include "esp_crt_bundle.h"
#include "esp_wifi.h"
#include "nvs_flash.h"
#include "lwip/err.h"
#include "lwip/sys.h"

/*
These are a few commonly used functions or
implementations to reduce the amount of
code that has to be rewritten over and over...
*/

void easy_wifi_connect(wifi_config_t wifi_config, int max_retry, bool wait_for_ip, bool wait_for_connect);
void easy_wifi_disconnect();
bool wifi_is_connected();

#endif