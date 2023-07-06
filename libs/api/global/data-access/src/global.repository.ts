import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Global
} from '../schemas';

import { IGlobal } from '@event-participation-trends/api/global/util';

@Injectable()
export class GlobalRepository {
    constructor(
        @InjectModel(Global.name) private globalModel: mongoose.Model<Global>,
    ){}

    async createGlobal(data: IGlobal){
        await this.globalModel.create(data);
    }   

    async getGlobal(){
        return await this.globalModel.find();
    }

    async replaceGlobal(data: IGlobal){
        await this.globalModel.deleteMany({});
        return this.createGlobal(data);
    }

}