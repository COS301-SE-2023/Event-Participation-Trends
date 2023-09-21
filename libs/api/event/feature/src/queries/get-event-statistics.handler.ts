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
    const attendance_over_time_data: {time: number, devices: number}[] = [];

    if (events.length == 0) {
      return <IGetEventStatisticsResponse>{
        total_attendance: total_attendance,
        average_attendance: average_attendance,
        peak_attendance: peak_attendance,
        turnover_rate: turnover_rate,
        average_attendance_time: average_attendance_time,
        max_attendance_time: max_attendance_time,
        attendance_over_time_data: attendance_over_time_data,
      };
    }

    turnover_rate = 0;

    const devices = events[0].Devices ? events[0].Devices : [];

    //compute statistics begin

    const uniqueDevices = new Set();

    const devicesOverTime = new Map<number, Set<number>>();
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

      const deviceSet = devicesOverTime.get(device.timestamp.getTime());
      if (deviceSet) {
        deviceSet.add(device.id);
      } else {
        devicesOverTime.set(device.timestamp.getTime(), new Set([device.id]));
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
    average_attendance = total_unique_devices / devicesOverTime.size ? total_unique_devices / devicesOverTime.size : 0;
    average_attendance_time = total_attendance_time / deviceTimeRange.size ? total_attendance_time / deviceTimeRange.size : 0;

    // Initialize the devicesOverInterval map
    const devicesOverInterval: Map<number, Set<number>> = new Map();

    console.log("events", events);
    console.log("events[0]", events[0]);
    console.log("events[0].StartDate", events[0].StartDate);

    // Get the start time of the event
    const startTime: Date = new Date(events[0].StartDate? events[0].StartDate : 0);

    // Define the interval duration in minutes
    const intervalDuration = 20;

    // Iterate through the originalMap
    for (const [time, numbers] of devicesOverTime.entries()) {
      // Calculate the time since the start of the event
      const timeSinceStart: number = (time - startTime.getTime()) / (1000 * 60);
      // console.log(new Date(time), " => ", new Date(startTime.getTime()), " = ", timeSinceStart);

      // Determine the interval key
      const intervalKey: number = Math.floor(timeSinceStart / intervalDuration) * intervalDuration;

      // Initialize or get the set for this interval in devicesOverInterval
      const intervalSet: Set<number> = devicesOverInterval.get(intervalKey) || new Set();

      // Add the numbers from the original set to the interval set
      for (const number of numbers) {
        intervalSet.add(number);
      }

      // Update devicesOverInterval with the combined set
      devicesOverInterval.set(intervalKey, intervalSet);
    }


    // // set attendance over time from devicesOverTime

    // const result = new Map<number, Set<number>>();

    // for (const [datey, numberSet] of devicesOverTime) {

    //   const date = new Date(datey);
    //   // Calculate the interval key (e.g., "10:00-10:20")
    //   const intervalStart = new Date(date);
    //   intervalStart.setMinutes(Math.floor(date.getMinutes() / 20) * 20);
    //   intervalStart.setSeconds(0);
    //   intervalStart.setMilliseconds(0);

    //   const intervalEnd = new Date(intervalStart);
    //   intervalEnd.setMinutes(intervalEnd.getMinutes() + 20);

    //   const intervalKey = intervalStart.getTime();

    //   // Merge the numbers into the result map
    //   if (!result.has(intervalKey)) {
    //     result.set(intervalKey, new Set<number>());
    //   }

    //   const mergedSet = result.get(intervalKey)!;
    //   for (const number of numberSet) {
    //     mergedSet.add(number);
    //   }
    // }

    for (const [key, value] of devicesOverInterval.entries()) {
      console.log(key, " => " ,value.size);
      attendance_over_time_data.push({time: key, devices: value.size});
    }



    //compute statistics end

    return <IGetEventStatisticsResponse>{
      total_attendance: total_attendance,
      average_attendance: average_attendance.toFixed(2) ? average_attendance.toFixed(2) : 0,
      peak_attendance: peak_attendance.toFixed(2) ? peak_attendance.toFixed(2) : 0,
      turnover_rate: turnover_rate.toFixed(2) ? turnover_rate.toFixed(2) : 0,
      average_attendance_time: average_attendance_time.toFixed(2) ? average_attendance_time.toFixed(2) : 0,
      max_attendance_time: max_attendance_time.toFixed(2) ? max_attendance_time.toFixed(2) : 0,
      attendance_over_time_data: attendance_over_time_data,
    };
  }
}
