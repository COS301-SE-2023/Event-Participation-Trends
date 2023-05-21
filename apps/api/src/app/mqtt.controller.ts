import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('mqtt')
export class MqttController {
    @MessagePattern(process.env.MQTT_TOPIC_BLE)
    async mqtt_ble(@Payload() data) {
        console.log(data);
        return `Received ${data} on ${process.env.MQTT_TOPIC_BLE}}`
    };
    @MessagePattern(process.env.MQTT_TOPIC_WIFI)
    async mqtt_wifi(@Payload() data) {
        console.log(data);
        return `Received ${data} on ${process.env.MQTT_TOPIC_WIFI}}`
    }
}