import { Injectable } from "@nestjs/common";

@Injectable()
export class PositioningService {

    

}

interface TranslationMatrix {
    x: number;
    y: number;
  }
  
  interface SensorReading {
    x: number;
    y: number;
    signal_strength: number;
    bt_id: number;
  }
  
  export function transform_sensor_matrices(array: number[]): number[] {
    const return_array: number[] = [];
  
    const sensor_readings = transform_to_sensor_readings(array);
  
    const grouped_sensor_readings = group_bid(sensor_readings);
  
    for (const [key, value] of grouped_sensor_readings.entries()) {
      const usable_readings = get_usable_readings(value);
  
      const translation_matrix = get_translation_matrix(usable_readings);
      const translated_sensor_readings = translate_sensors(
        usable_readings,
        translation_matrix
      );
  
      return_array.push(key);
  
      return_array.push(translated_sensor_readings[0].signal_strength);
      return_array.push(translated_sensor_readings[1].signal_strength);
      return_array.push(translated_sensor_readings[2].signal_strength);
  
      return_array.push(translated_sensor_readings[0].x);
      return_array.push(translated_sensor_readings[0].y);
      return_array.push(translated_sensor_readings[1].x);
      return_array.push(translated_sensor_readings[1].y);
      return_array.push(translated_sensor_readings[2].x);
      return_array.push(translated_sensor_readings[2].y);
  
      return_array.push(translation_matrix.x);
      return_array.push(translation_matrix.y);
    }
  
    return return_array;
  }
  
  export function reverse_transform_devices(array: number[]): number[] {
    const return_array: number[] = [];
  
    let count = 0;
    let bt_id = 0;
    let x = 0.0;
    let y = 0.0;
    let translation_x = 0.0;
  
    for (let i = 0; i < array.length; i++) {
      const value = array[i];
  
      switch (count) {
        case 0:
          bt_id = value;
          break;
        case 1:
          x = value;
          break;
        case 2:
          y = value;
          break;
        case 3:
          translation_x = value;
          break;
        case 4:
          return_array.push(bt_id);
          return_array.push(x + translation_x);
          return_array.push(y + value);
  
          count = -1;
          break;
      }
  
      count += 1;
    }
  
    return return_array;
  }
  
  function transform_to_sensor_readings(array: number[]): SensorReading[] {
    const sensor_readings: SensorReading[] = [];
    let current_sensor_reading: SensorReading = {
      x: 0.0,
      y: 0.0,
      signal_strength: 0.0,
      bt_id: 0,
    };
    let count = 0;
  
    for (let i = 0; i < array.length; i++) {
      const value = array[i];
  
      switch (count) {
        case 0:
          current_sensor_reading.x = value;
          break;
        case 1:
          current_sensor_reading.y = value;
          break;
        case 2:
          current_sensor_reading.signal_strength = value;
          break;
        case 3:
          current_sensor_reading.bt_id = value;
          sensor_readings.push(current_sensor_reading);
          current_sensor_reading = {
            x: 0.0,
            y: 0.0,
            signal_strength: 0.0,
            bt_id: 0,
          };
          count = -1;
          break;
      }
  
      count += 1;
    }
  
    return sensor_readings;
  }
  
  function group_bid(sensor_readings: SensorReading[]): Map<number, SensorReading[]> {
    const map: Map<number, SensorReading[]> = new Map();
  
    for (const sensor_reading of sensor_readings) {
      const bt_id = sensor_reading.bt_id;
  
      if (map.has(bt_id)) {
        const sensor_readings = map.get(bt_id)!;
        sensor_readings.push(sensor_reading);
      } else {
        const sensor_readings: SensorReading[] = [sensor_reading];
        map.set(bt_id, sensor_readings);
      }
    }
  
    return map;
  }
  
  function get_usable_readings(sensor_readings: SensorReading[]): SensorReading[] {
    // sort by signal strength
    sensor_readings.sort((a, b) =>
      b.signal_strength - a.signal_strength
    );
  
    // pop elements until only 3 are left
    while (sensor_readings.length > 3) {
      sensor_readings.pop();
    }
  
    return sensor_readings;
  }
  
  function get_translation_matrix(sensor_readings: SensorReading[]): TranslationMatrix {
    let x_sum = 0.0;
    let y_sum = 0.0;
  
    for (const sensor_reading of sensor_readings) {
      x_sum += sensor_reading.x;
      y_sum += sensor_reading.y;
    }
  
    const x_avg = x_sum / 3;
    const y_avg = y_sum / 3;
  
    return { x: x_avg, y: y_avg };
  }
  
  function translate_sensors(
    sensor_readings: SensorReading[],
    translation_matrix: TranslationMatrix
  ): SensorReading[] {
    const translated_sensor_readings: SensorReading[] = [];
  
    for (const sensor_reading of sensor_readings) {
      const x = sensor_reading.x - translation_matrix.x;
      const y = sensor_reading.y - translation_matrix.y;
  
      translated_sensor_readings.push({
        x,
        y,
        signal_strength: sensor_reading.signal_strength,
        bt_id: sensor_reading.bt_id,
      });
    }
  
    return translated_sensor_readings;
  }
  
  
  function generateDataPoints(): number[] {
    const dataPoints: number[] = [];
    let idCounter = 1;
  
    for (let i = 0; i < 1000; i++) {
  
      // [x, y, signal_strength, id, x, y, signal_strength, id, x, y, signal_strength, id, ...]
  
      const x = Number((Math.random() * 100).toFixed(4));
      const y = Number((Math.random() * 100).toFixed(4));
      const signalStrength = Number((Math.random() * 100).toFixed(4));
  
      dataPoints.push(x);
      dataPoints.push(y);
      dataPoints.push(signalStrength);
      dataPoints.push(idCounter);
  
      // Increment the id counter every 3rd iteration
      if ((i + 1) % 5 === 0) {
        idCounter++;
      }
    }
  
    return dataPoints;
  }