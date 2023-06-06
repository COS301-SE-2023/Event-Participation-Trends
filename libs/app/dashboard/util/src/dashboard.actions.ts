export class GetAccessRequests {
    static readonly type = '[Dashboard] Get Access Requests';
    constructor(public eventName: string) { }
}

export class GetDashboardStatistics {
    static readonly type = '[Dashboard] Get Dashboard Statistics';
    constructor(public readonly eventName: string) { }
}