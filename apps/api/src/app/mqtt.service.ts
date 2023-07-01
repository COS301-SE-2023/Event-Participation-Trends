import { Injectable } from '@nestjs/common';

@Injectable()
export class MqttService {
  processData(data: any) {
    // This is where we will be placing the data into the database
    console.log(data);
  }
}
