# Getting up and running
Please note that we had security in mind from the very beginning of this project, therefore it is critical to use ssl certificates in order for everything to work as designed.

## Setting up NGinx (Firmware Hosting)
This is placed in /etc/nginx/sites-available/\<domain>
```nginx
server {
    listen 80;
    listen [::]:80;

    server_name <domain>;

    return 301 https://<domain>;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;

    server_name <domain>;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    location / {
        root /var/www/html;
        index index.html;
    }
}
```
Place the cert files in /etc/ssl/certs/ or change the above config.
This configuration forces the use of https.

Then create a sym-link to */etc/nginx/sites-enabled/*

```
Firmware should now be placed in /var/www/html/firmware.bin 
```
NOTE: Ensure that the firmware is encrypted. This is being hosted on a public endpoint.

---

## Setting up Mosquitto MQTT (wss)
This file is placed in */etc/mosquitto/conf.d/default.conf*
```bash
password_file /etc/mosquitto/passwd
allow_anonymous false
listener 8883
protocol websockets
certfile /etc/mosquitto/certs/fullchain.pem
keyfile /etc/mosquitto/certs/privkey.pem
cafile /etc/mosquitto/certs/cert.pem
tls_version tlsv1.2
```
Now place the needed certs in the /etc/mosquitto/certs/ directory.
Run the following commands
```bash
sudo chmod 700 /etc/mosquitto/certs
```
```bash
sudo chmod 600 /etc/mosquitto/certs/*.pem
```
```bash
sudo chown -R mosquitto:mosquitto /etc/mosquitto/certs
```
This will ensure that the directory has the proper permissions and that certificates can only be read my Mosquitto

---

## Generating the certificates for a DuckDns domain
[DuckDns Certbot Plugin](https://github.com/infinityofspace/certbot_dns_duckdns)

Prerequisite:

### Install Certbot using the following
```bash
sudo apt update
sudo apt install python3 python3-venv libaugeas0
sudo apt-get remove certbot
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot
sudo ln -s /opt/certbot/bin/certbot /usr/bin/certbot
```
Create a non-root user and run the following command
```bash
certbot certonly \
  --non-interactive \
  --agree-tos \
  --email \<email_address> \
  --preferred-challenges dns \
  --authenticator dns-duckdns \
  --dns-duckdns-token \<duckdns_token> \
  --dns-duckdns-propagation-seconds 60 \
  -d "\<subdomain>.duckdns.org"\
  --config-dir ./conf --work-dir ./work --logs-dir ./logs
```
This will generate the certs in ./conf/live/\<subdomain>.duckdns.org/

It is recommended to create either a sym-link or copy the certs to /etc/mosquitto/certs/ using a cron job.

Please refer to the Certbot documentation for  renewing certificates, reissuing certificates, and revoking certificates.

### DuckDNS cron script

[Source: GitHub](https://gist.github.com/BlackthornYugen/22d84bc6e9f61d9937ede170f30e93cb)
```bash
#!/usr/bin/env bash
DUCKPATH=~/.ssl/duck/
TOKEN=<token>
DOMAINS=<subdomain>
curl -sSv "https://www.duckdns.org/update?domains=${DOMAINS}&token=${TOKEN}&ip=" \
  2>> ${DUCKPATH}/stderr.log \
   >> ${DUCKPATH}/stdout.log
printf ' - ' >> ${DUCKPATH}/stdout.log
date >> ${DUCKPATH}/stdout.log
```
This can be placed in /etc/cron.\<interval>/script.sh

---

## ESP-IDF
Please refer to Espressif's own documentation on installing the ESP-IDF.

### Building the firmware
```bash
idf.py build
```
This can then be uploaded to the NGinx server */var/www/html/firmware.bin*, or even done by placing the following in a script (Assuming that you have SSH setup)
```bash
scp build/firmware.bin <user>@<domain>:/var/www/html/firmware.bin
```
Remember that firmware uploaded to this url will be used to automatically update all sensors.

This repository will already include the latest firmware that can be used.

# MENUCONFIG Options
## OTA Specific options
- CONFIG_OTA_ENABLE
- CONFIG_OTA_ROUTER_SSID
- CONFIG_OTA_ROUTER_PASSWD

## Mesh Specific options
- CONFIG_MESH_ENABLE
- CONFIG_MESH_ROUTER_SSID
- CONFIG_MESH_ROUTER_PASSWD

There are a lot more options for Mesh configuration, please see the menuconfig options for more information, these are only the most important ones.

# Hardware
This fimware was made to be as modular as possible, if you are using an ESP32 (That has support for classic bluetooth), you can enable it via the corresponding option in menuconfig.


# TODO:
  - ENABLE CLASSIC BLUETOOTH SUPPORT
  - UPDATE MENUCONFIG FOR 
    <!-- - OTA_URL -->
    - CLASSIC_BLUETOOTH_ENABLE
    - BLE_ENABLE
    <!-- - MQTT_BROKER_URL -->
    <!-- - MQTT_BROKER_USERNAME -->
    <!-- - MQTT_BROKER_PASSWD -->
    <!-- - TOPIC for publishing sensor readings -->
    <!-- - TOPIC for publishing sensor heartbeat / status -->