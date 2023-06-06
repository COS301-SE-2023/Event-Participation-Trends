export class GetAccessRequests {
    static readonly type = '[AccessRequests] Get Access Requests';
    constructor(public readonly eventName: string) { }
}