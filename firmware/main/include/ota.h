#ifndef OTA_H
#define OTA_H

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
#include "utils.h"

#ifdef __cplusplus
extern "C" {
#endif
void perform_ota_advanced();
#ifdef __cplusplus
}
#endif
#endif