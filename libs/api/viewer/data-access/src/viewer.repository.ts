import { Injectable } from '@nestjs/common';
import { IUser } from '@event-participation-trends/api/viewer/util';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {User} from '../schemas';

@Injectable()
export class ViewerRepository {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>
    ){}

    async createViewer(user: IUser){
        await this.userModel.create(user);
    }    
}
