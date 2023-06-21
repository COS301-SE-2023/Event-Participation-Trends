export class GetDashboardStatistics {
  static readonly type = '[Dashboard] Get Dashboard Statistics';
  constructor(public readonly eventName: string) {}
}

export class SetDashboardState {
  static readonly type = '[Dashboard] Set Dashboard State';
  constructor(
    public readonly eventData: any | null | undefined,
    public readonly accessRequests: any[] | null | undefined,
    public readonly statistics: any[] | null | undefined
  ) {}
}

export class SetEventData {
    static readonly type = '[Dashboard] Set Event Data';
    constructor(public readonly eventData: any | null | undefined) {}
}

export class SetAccessRequests {
    static readonly type = '[Dashboard] Set Access Requests';
    constructor(public readonly accessRequests: any[] | null | undefined) {}
}

export class SetDashboardStatistics {
    static readonly type = '[Dashboard] Set Dashboard Statistics';
    constructor(public readonly statistics: any[] | null | undefined) {}
}
