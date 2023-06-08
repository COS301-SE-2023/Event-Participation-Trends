import { Injectable } from '@nestjs/common';
import { IUser } from '@event-participation-trends/api/user/util';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {User} from '../schemas';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ){}

    async createUser(user: IUser){
        await this.userModel.create(user);
    }    

    async getUser(userEmail: string){
        return await this.userModel.find({Email: userEmail});
    }

    async getUsersByRole(userRole: string){
        return await this.userModel.find({Role: userRole});
    }
}
