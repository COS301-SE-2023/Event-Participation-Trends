import { EventRepository } from '@event-participation-trends/api/event/data-access';
import {
  GetEventStatisticsQuery,
  IGetEventStatisticsResponse,
} from '@event-participation-trends/api/event/util';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';

@QueryHandler(GetEventStatisticsQuery)
export class GetEventStatisticsHandler
  implements
    IQueryHandler<GetEventStatisticsQuery, IGetEventStatisticsResponse>
{
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(query: GetEventStatisticsQuery) {
    const eventIdObj = <Types.ObjectId>(<unknown>query.request.eventId);
    const events = await this.eventRepository.getDevicePosotions(eventIdObj);

    let total_attendance = 0;
    let average_attendance = 0;
    let peak_attendance = 0;
    let turnover_rate = 0;
    let average_attendance_time = 0;
    let max_attendance_time = 0;

    if (events.length == 0) {
      return <IGetEventStatisticsResponse>{
        total_attendance: total_attendance,
        average_attendance: average_attendance,
        peak_attendance: peak_attendance,
        turnover_rate: turnover_rate,
        average_attendance_time: average_attendance_time,
        max_attendance_time: max_attendance_time,
      };
    }

    turnover_rate = 0;

    const devices = events[0].Devices ? events[0].Devices : [];

    //compute statistics begin

    const uniqueDevices = new Set();

    const devicesOverTime = new Map<Date, Set<number>>();
    const deviceTimeRange = new Map<number, { start: Date; end: Date }>();

    // iterate over all devices

    for (const device of devices) {
      if (!device.timestamp || !device.id) {
        continue;
      }

      uniqueDevices.add(device.id);

      if (deviceTimeRange.has(device.id)) {
        const range = deviceTimeRange.get(device.id);
        if (range) {
          if (device.timestamp < range.start) {
            range.start = device.timestamp;
          }
          if (device.timestamp > range.end) {
            range.end = device.timestamp;
          }
        }
      }

      const deviceSet = devicesOverTime.get(device.timestamp);
      if (deviceSet) {
        deviceSet.add(device.id);
      } else {
        devicesOverTime.set(device.timestamp, new Set([device.id]));
      }
    }

    // compute average attendance

    let total_unique_devices = 0;

    for (const [key, value] of devicesOverTime.entries()) {
      if (value.size > peak_attendance) {
        peak_attendance = value.size;
      }
      total_unique_devices += value.size;
    }

    let total_attendance_time = 0;

    for (const [key, value] of deviceTimeRange.entries()) {
      const diff = value.end.getTime() - value.start.getTime();
      total_attendance_time += diff;
      if (diff > max_attendance_time) {
        max_attendance_time = diff;
      }
    }

    total_attendance = uniqueDevices.size;
    average_attendance = total_unique_devices / devicesOverTime.size;
    average_attendance_time = total_attendance_time / deviceTimeRange.size;

    //compute statistics end

    return <IGetEventStatisticsResponse>{
      total_attendance: total_attendance,
      average_attendance: average_attendance,
      peak_attendance: peak_attendance,
      turnover_rate: turnover_rate,
      average_attendance_time: average_attendance_time,
      max_attendance_time: max_attendance_time,
    };
  }
}
