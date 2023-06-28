import { Injectable } from '@nestjs/common';
import { IUser } from '@event-participation-trends/api/user/util';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {User} from '../schemas';
import { Types } from 'mongoose';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ){}

    async createUser(user: IUser){
        await this.userModel.create(user);
    }    

    //regactor
    async getUser(userEmail: string){
        return await this.userModel.find({Email: userEmail});
    }

    async getUserById(userID: Types.ObjectId){
        return await this.userModel.find({ _id: {$eq: userID}},);
    }

    //refactor
    async getUsersByRole(userRole: string){
        return await this.userModel.find({Role: userRole});
    }

    async getAllUsers(){
        return await this.userModel.find({Role: { $ne: "admin"}});
    }

    async updateUserRole(userEmail: string, userRole: string){
        await this.userModel.updateOne({Email: {$eq: userEmail}},{$set: {Role: userRole}});
    } 

    async addViewingEvent(userID: Types.ObjectId, eventID: Types.ObjectId){
        return await this.userModel.updateOne(
            { _id: {$eq: userID}},
            { $push: { Viewing: eventID } });
    }

    async getPopulatedViewingEvents(userId: Types.ObjectId){
        return await this.userModel.find(
            {_id :{$eq: userId}},
            { Viewing: 1 }).populate('Viewing');
    }

    async removeEvent(eventID: Types.ObjectId, userID: Types.ObjectId){
        return await this.userModel.updateOne(
            {_id :{$eq: userID}},
            { $pull: { Viewing: eventID } });
    }
}
