import { EventRepository} from '@event-participation-trends/api/event/data-access';
import { UserRepository} from '@event-participation-trends/api/user/data-access';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class DatabaseService {

    constructor(
        private readonly eventRepository: EventRepository,
        private readonly userRepository: UserRepository,
    ){}

    async checkIfManager(eventId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean>{
        const managerId = (await this.eventRepository.getManager(eventId))[0].Manager;

        if(managerId?.toString() == userId.toString())
            return true
        else
            return false;
    }

    async checkManagerOrAdmin(eventId: Types.ObjectId, managerEmail: string): Promise<boolean>{
        const managerId = (await this.userRepository.getUser(managerEmail))[0]._id;

        //check if manager
        const isManager = await this.checkIfManager(eventId,managerId);

        //check if admin
        const managerDocs = await this.userRepository.getAllAdmins();
        let isAdmin = false;
        managerDocs.forEach(doc =>{
            if(doc._id.toString() == managerId.toString())
                isAdmin = true;
        })

        return isAdmin || isManager;
    }

}