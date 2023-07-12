import { IEvent } from "@event-participation-trends/api/event/util";

export class SetViewEvents {
    static readonly type = '[Viewevents] SetViewEvents';
    constructor(public newState: any) {}
}

export class SetAllEvents {
    static readonly type = '[Viewevents] SetAllEvents';
    constructor(public updatedEvents: IEvent[]) {}
}

export class SetSubscribedEvents {
    static readonly type = '[Viewevents] SetSubscribedEvents';
    constructor(public updatedEvents: IEvent[]) {}
}

export class SetUnsubscribedEvents {
    static readonly type = '[Viewevents] SetUnsubscribedEvents';
    constructor(public updatedEvents: IEvent[]) {}
}

export class SetMyEvents {
    static readonly type = '[Viewevents] SetMyEvents';
    constructor(public updatedEvents: IEvent[]) {}
}

export class SetRole {
    static readonly type = '[Viewevents] SetRole';
    constructor(public newRole: string) {}
}

export class SetSearchValue {
    static readonly type = '[Viewevents] SetSearchValue';
    constructor(public newSearchValue: string) {}
}

export class SetAddressLocation {
    static readonly type = '[Viewevents] SetAddressLocation';
    constructor(public newAddressLocation: string) {}
}

export class GetAllEvents {
    static readonly type = '[Viewevents] GetAllEvents';
}

export class GetSubscribedEvents {
    static readonly type = '[Viewevents] GetSubscribedEvents';
}

export class GetUnsubscribedEvents {
    static readonly type = '[Viewevents] GetUnsubscribedEvents';
}

export class GetMyEvents { // managed events
    static readonly type = '[Viewevents] GetMyEvents';
}

export class GetRole {
    static readonly type = '[Viewevents] GetRole';
}

export class GetSearchValue {
    static readonly type = '[Viewevents] GetSearchValue';
}

// export class GetAddressLocation {
//     static readonly type = '[Viewevents] GetAddressLocation';
// }

export class SendViewRequest {
    static readonly type = '[Viewevents] SendViewRequest';
    constructor(public eventId: string) {}
}


