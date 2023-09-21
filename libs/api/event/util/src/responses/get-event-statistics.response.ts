
export interface IGetEventStatisticsResponse {
    total_attendance: number | undefined |null,
    average_attendance: number | undefined |null,
    peak_attendance: number | undefined |null,
    turnover_rate: number | undefined |null,
    average_attendance_time: number | undefined |null,
    max_attendance_time: number | undefined |null,
    attendance_over_time_data: {time: number, devices: number}[] | undefined |null,
}