import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttService {


    processData(data: any) {
        console.log(data);
    }

}
