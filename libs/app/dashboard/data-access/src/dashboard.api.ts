import { Injectable } from "@angular/core";

@Injectable()
export class DashboardApi {
    async getAccessRequests(eventName: string): Promise<any[]> {
        return Promise.resolve([]);
    }

    async getDashboardStatistics(eventName: string): Promise<any[]> {
        return Promise.resolve([]);
    }
}