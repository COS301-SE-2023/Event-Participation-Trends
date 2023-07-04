import { Injectable } from '@nestjs/common';

export interface Circle {
  x: number;
  y: number;
  r: number;
}

export interface SensorReading {
  x: number;
  y: number;
  signal_strength: number;
  id: number;
  timestamp: Date;
}

export interface PositioningSet {
  id: number;
  Ax: number;
  Ay: number;
  Bx: number;
  By: number;
  Cx: number;
  Cy: number;
  As: number;
  Bs: number;
  Cs: number;
  timestamp: Date;
}

export interface Position {
  x: number;
  y: number;
  timestamp: Date;
}

@Injectable()
export class PositioningService {

  public findPositions(positioning_sets: PositioningSet[]): Position[] {
    const positions: Position[] = [];

    for (const positioning_set of positioning_sets) {
      const position = this.findPosition(positioning_set);
      positions.push(position);
    }

    return positions;
  }

  private findPosition(positioning_set: PositioningSet): Position {

    const { id, Ax, Ay, Bx, By, Cx, Cy, As, Bs, Cs, timestamp } = positioning_set;

    const [x, y] = this.calculateP(Ax, Ay, Bx, By, Cx, Cy, As, Bs, Cs);

    return {
      x,
      y,
      timestamp
    };

  }

  private findIntersectionOfTwoCircles(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number
  ) {
    const centerdx: number = x1 - x2;
    const centerdy: number = y1 - y2;
    const R = Math.sqrt(centerdx * centerdx + centerdy * centerdy);
  
    if (!(Math.abs(r1 - r2) <= R && R <= r1 + r2)) {
      return [];
    }
  
    const R2 = R * R;
    const R4 = R2 * R2;
    const a = (r1 * r1 - r2 * r2) / (2 * R2);
    const r2r2 = r1 * r1 - r2 * r2;
  
    const c = Math.sqrt((2 * (r1 * r1 + r2 * r2)) / R2 - (r2r2 * r2r2) / R4 - 1);
  
    const fx = (x1 + x2) / 2 + a * (x2 - x1);
    const gx = (c * (y2 - y1)) / 2;
    const ix1 = fx + gx;
    const ix2 = fx - gx;
  
    const fy = (y1 + y2) / 2 + a * (y2 - y1);
    const gy = (c * (x1 - x2)) / 2;
    const iy1 = fy + gy;
    const iy2 = fy - gy;
  
    return [
      [ix1, iy1],
      [ix2, iy2],
    ];
  }

  private calculateP(
    Ax: number,
    Ay: number,
    Bx: number,
    By: number,
    Cx: number,
    Cy: number,
    As: number,
    Bs: number,
    Cs: number
  ):number[] | [] {
    const circles: Circle[] = [];
  
    // Calculate the ratios
    const rAB = As / Bs;
    const rBC = Bs / Cs;
    const rCA = Cs / As;
  
    // Calculate the coefficients
    if (rAB !== 1) {
      const lAB = (2 * Bx * Math.pow(rAB, 2) - 2 * Ax) / (1 - Math.pow(rAB, 2));
      const mAB = (2 * By * Math.pow(rAB, 2) - 2 * Ay) / (1 - Math.pow(rAB, 2));
      const cAB =
        (Math.pow(Ax, 2) +
          Math.pow(Ay, 2) -
          Math.pow(Bx, 2) * Math.pow(rAB, 2) -
          Math.pow(By, 2) * Math.pow(rAB, 2)) /
        (1 - Math.pow(rAB, 2));
  
      circles.push(
        {
          x: -lAB / 2,
          y: -mAB / 2,
          r: Math.sqrt(-cAB + Math.pow(lAB, 2) / 4 + Math.pow(mAB, 2) / 4)
        }
      );
    }
  
    if (rBC !== 1) {
      const lBC = (2 * Cx * Math.pow(rBC, 2) - 2 * Bx) / (1 - Math.pow(rBC, 2));
      const mBC = (2 * Cy * Math.pow(rBC, 2) - 2 * By) / (1 - Math.pow(rBC, 2));
      const cBC =
        (Math.pow(Bx, 2) +
          Math.pow(By, 2) -
          Math.pow(Cx, 2) * Math.pow(rBC, 2) -
          Math.pow(Cy, 2) * Math.pow(rBC, 2)) /
        (1 - Math.pow(rBC, 2));
  
      circles.push(
        {
          x: -lBC / 2,
          y: -mBC / 2,
          r: Math.sqrt(-cBC + Math.pow(lBC, 2) / 4 + Math.pow(mBC, 2) / 4)
        }
      );
    }
  
    if (rCA !== 1) {
      const lCA = (2 * Ax * Math.pow(rCA, 2) - 2 * Cx) / (1 - Math.pow(rCA, 2));
      const mCA = (2 * Ay * Math.pow(rCA, 2) - 2 * Cy) / (1 - Math.pow(rCA, 2));
      const cCA =
        (Math.pow(Cx, 2) +
          Math.pow(Cy, 2) -
          Math.pow(Ax, 2) * Math.pow(rCA, 2) -
          Math.pow(Ay, 2) * Math.pow(rCA, 2)) /
        (1 - Math.pow(rCA, 2));
  
      circles.push(
        {
          x: -lCA / 2,
          y: -mCA / 2,
          r: Math.sqrt(-cCA + Math.pow(lCA, 2) / 4 + Math.pow(mCA, 2) / 4)
        }
      );
    }
  
    let intersections: number[][] = [];
  
    if (circles.length <= 1) {
      return [];
    } else if (circles.length >= 2) {
      intersections = this.findIntersectionOfTwoCircles(
        circles[0].x,
        circles[0].y,
        circles[0].r,
        circles[1].x,
        circles[1].y,
        circles[1].r
      );
  
      if (circles.length === 3) {
        intersections = intersections.filter((intersection) => {
          const left =
            Math.pow(intersection[0] - circles[2].x, 2) +
            Math.pow(intersection[1] - circles[2].y, 2);
          const right = circles[2].r;
  
          return Math.pow(left - right, 2) > 0.000001;
        });
      }
    }
  
    if (intersections.length === 0) {
      return [];
    } else if (intersections.length === 1) {
      return intersections[0];
    }
  
    // Find the true intersection closest to the average of all sensors
    const average_x = (Ax + Bx + Cx) / 3;
    const average_y = (Ay + By + Cy) / 3;
  
    let closest_x = intersections[0][0];
    let closest_y = intersections[0][1];
  
    let closest_distance = Math.sqrt(
      Math.pow(average_x - closest_x, 2) + Math.pow(average_y - closest_y, 2)
    );
  
    for (const intersection of intersections) {
      const distance = Math.sqrt(
        Math.pow(average_x - intersection[0], 2) +
          Math.pow(average_y - intersection[1], 2)
      );
  
      if (distance < closest_distance) {
        closest_x = intersection[0];
        closest_y = intersection[1];
        closest_distance = distance;
      }
    }
  
    return [closest_x, closest_y];
  }

  public transformToSensorMatrices(sensor_readings: SensorReading[]): PositioningSet[] {
    const return_array: PositioningSet[] = [];
  
    const grouped_sensor_readings = this.groupByID(sensor_readings);
  
    for (const [key, value] of grouped_sensor_readings.entries()) {
      const usable_readings = this.getUsableReadings(value);

      const positioning_set: PositioningSet = {
        id: key,
        Ax: usable_readings[0].x,
        Ay: usable_readings[0].y,
        Bx: usable_readings[1].x,
        By: usable_readings[1].y,
        Cx: usable_readings[2].x,
        Cy: usable_readings[2].y,
        As: usable_readings[0].signal_strength,
        Bs: usable_readings[1].signal_strength,
        Cs: usable_readings[2].signal_strength,
        timestamp: new Date(),
      };

      return_array.push(positioning_set);
    }
  
    return return_array;
  }

  private transformToSensorReadings(array: number[]): SensorReading[] {
    const sensor_readings: SensorReading[] = [];
    let current_sensor_reading: SensorReading = {
      x: 0.0,
      y: 0.0,
      signal_strength: 0.0,
      id: 0,
      timestamp: new Date(),
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
          current_sensor_reading.id = value;
          sensor_readings.push(current_sensor_reading);
          current_sensor_reading = {
            x: 0.0,
            y: 0.0,
            signal_strength: 0.0,
            id: 0,
            timestamp: new Date(),
          };
          count = -1;
          break;
      }
  
      count += 1;
    }
  
    return sensor_readings;
  }

  private groupByID(
    sensor_readings: SensorReading[]
  ): Map<number, SensorReading[]> {
    const map: Map<number, SensorReading[]> = new Map();
  
    for (const sensor_reading of sensor_readings) {
      const id = sensor_reading.id;
  
      if (map.has(id)) {
        const sensor_readings = map.get(id)!;
        sensor_readings.push(sensor_reading);
      } else {
        const sensor_readings: SensorReading[] = [sensor_reading];
        map.set(id, sensor_readings);
      }
    }
  
    return map;
  }

  private getUsableReadings(
    sensor_readings: SensorReading[]
  ): SensorReading[] {
    // sort by signal strength
    sensor_readings.sort((a, b) => b.signal_strength - a.signal_strength);
  
    // pop elements until only 3 are left
    while (sensor_readings.length > 3) {
      sensor_readings.pop();
    }
  
    return sensor_readings;
  }
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
