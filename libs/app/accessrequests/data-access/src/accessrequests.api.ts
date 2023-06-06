import { Injectable } from "@angular/core";

@Injectable()
export class AccessRequestsApi {
    async getAccessRequests(eventName: string): Promise<any[]> {
        return Promise.resolve([]);
    }

    async rejectAccessRequest(userId: string): Promise<any[]> {
        return Promise.resolve([]);
    }
}