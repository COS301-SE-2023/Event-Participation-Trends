import { Injectable } from '@nestjs/common';

export interface Circle {
  x: number;
  y: number;
  r: number;
}

export interface SensorReading {
  x: number;
  y: number;
  distance: number;
  id: number;
  timestamp: Date;
}

export interface Position {
  id: number;
  x: number;
  y: number;
  timestamp: Date;
}

@Injectable()
export class PositioningService {
  public getPositions(sensor_readings: SensorReading[]): Position[] {
    const positions_of_targets: Position[] = [];

    const device_to_readings_map = this.groupByID(sensor_readings);

    for (const [id, readings] of device_to_readings_map) {
      // if less than three readings no position can be calculated
      if (readings.length < 3) {
        continue;
      }

      // sort by distance
      readings.sort((a, b) => a.distance - b.distance);

      // get the possible intersections of the three circles predicted as closest to the target
      const intersections_of_circles = this.getPossibleIntersections(
        readings[0].x,
        readings[0].y,
        readings[1].x,
        readings[1].y,
        readings[2].x,
        readings[2].y,
        readings[0].distance,
        readings[1].distance,
        readings[2].distance
      );

      // if no intersections found, continue
      if (intersections_of_circles.length === 0) {
        continue;
      }

      const best_intersection: number[] = [];
      let best_error = Infinity;

      // find centroid of intersections
      const centroid_x = (readings[0].x + readings[1].x + readings[2].x) / 3;
      const centroid_y = (readings[0].y + readings[1].y + readings[2].y) / 3;

      // find intersection closest to centroid
      for (const intersection of intersections_of_circles) {
        if (intersection.length !== 2) {
          continue;
        }

        const distance_error = Math.sqrt(
          Math.pow(intersection[0] - centroid_x, 2) +
          Math.pow(intersection[1] - centroid_y, 2)
        );

        if (distance_error < best_error) {
          best_intersection[0] = intersection[0];
          best_intersection[1] = intersection[1];
          best_error = distance_error;
        }
      }

      if (best_intersection.length !== 2) {
        continue;
      }

      positions_of_targets.push({
        id: id,
        x: best_intersection[0],
        y: best_intersection[1],
        timestamp: readings[0].timestamp,
      });
    }

    return positions_of_targets;
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

    const c = Math.sqrt(
      (2 * (r1 * r1 + r2 * r2)) / R2 - (r2r2 * r2r2) / R4 - 1
    );

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

  private getPossibleIntersections(
    Ax: number,
    Ay: number,
    Bx: number,
    By: number,
    Cx: number,
    Cy: number,
    As: number,
    Bs: number,
    Cs: number
  ): number[][] | [] {
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

      circles.push({
        x: -lAB / 2,
        y: -mAB / 2,
        r: Math.sqrt(-cAB + Math.pow(lAB, 2) / 4 + Math.pow(mAB, 2) / 4),
      });
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

      circles.push({
        x: -lBC / 2,
        y: -mBC / 2,
        r: Math.sqrt(-cBC + Math.pow(lBC, 2) / 4 + Math.pow(mBC, 2) / 4),
      });
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

      circles.push({
        x: -lCA / 2,
        y: -mCA / 2,
        r: Math.sqrt(-cCA + Math.pow(lCA, 2) / 4 + Math.pow(mCA, 2) / 4),
      });
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

          return Math.pow(left - right, 2) > 0.0001;
        });
      }
    }

    if (intersections.length === 0) {
      return [];
    }

    return intersections;
  }

  private groupByID(
    sensor_readings: SensorReading[]
  ): Map<number, SensorReading[]> {
    const device_to_readings_map: Map<number, SensorReading[]> = new Map();

    for (const sensor_reading of sensor_readings) {
      const device_id = sensor_reading.id;

      if (device_to_readings_map.has(device_id)) {
        const device_readings = device_to_readings_map.get(device_id);

        if (device_readings === undefined) {
          throw new Error('sensor_readings is undefined');
        }

        device_readings.push(sensor_reading);
      } else {
        const sensor_readings: SensorReading[] = [sensor_reading];
        device_to_readings_map.set(device_id, sensor_readings);
      }
    }

    return device_to_readings_map;
  }

  public rssiToDistance(
    rssi: number,
    measured_power = 46.4,
    environmental_factor = 3.05
  ): number {
    const distance = Math.pow(
      10,
      (measured_power + rssi) / (10 * environmental_factor)
    );

    return distance;
  }
}
