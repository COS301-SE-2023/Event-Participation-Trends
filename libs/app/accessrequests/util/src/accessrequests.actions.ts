export class GetAccessRequests {
    static readonly type = '[AccessRequests] Get Access Requests';
    constructor(public readonly eventName: string) { }
}

export class RejectAccessRequest {
    static readonly type = '[AccessRequests] Reject Access Request';
    constructor(public readonly userId: string) { }
}

export class ApproveAccessRequest {
    static readonly type = '[AccessRequests] Approve Access Request';
    constructor(public readonly userId: string) { }
}