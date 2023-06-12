import { Injectable } from '@nestjs/common';
import { IEventDetails } from '@event-participation-trends/api/event/util';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Event,
         Device,
         FloorLayout,
         DeviceLocation,
         EventLocation,
         Sensor,
         Stall,
         TEMP_DEVICE_BUFFER,
         TEMP_DEVICE_TO_DT,
} from '../schemas';
import { Types } from 'mongoose';

@Injectable()
export class EventRepository {
    constructor(
        @InjectModel(Event.name) private eventModel: mongoose.Model<Event>,
        @InjectModel(Device.name) private deviceModel: mongoose.Model<Device>,
        //@InjectModel(FloorLayout.name) private floorLayoutModel: mongoose.Model<FloorLayout>,
        @InjectModel(DeviceLocation.name) private deviceLocationModel: mongoose.Model<DeviceLocation>,
        @InjectModel(EventLocation.name) private EventLocationModel: mongoose.Model<EventLocation>,
        @InjectModel(Sensor.name) private sensorModel: mongoose.Model<Sensor>,
        @InjectModel(Stall.name) private stallModel: mongoose.Model<Stall>,
        @InjectModel(TEMP_DEVICE_BUFFER.name) private TEMP_DEVICE_BUFFERModel: mongoose.Model<TEMP_DEVICE_BUFFER>,
        @InjectModel(TEMP_DEVICE_TO_DT.name) private TEMP_DEVICE_TO_DTModel: mongoose.Model<TEMP_DEVICE_TO_DT>,
    ){}

    async createEvent(event: IEventDetails){
        await this.eventModel.create(event);
    }   

    async getAllEvents(){
        return await this.eventModel.find();
    }

    async getEventByName(eventName: string){
        return await this.eventModel.find({Name: {$eq: eventName}});
    }

    async getEventById(eventID: Types.ObjectId){
        return await this.eventModel.find({_id: {$eq: eventID}});
    }

    async getManagedEvents(managerID: Types.ObjectId){
        return await this.eventModel.find({Manager: {$eq: managerID}});
    }

    async createViewRequest(userID: Types.ObjectId, eventID: Types.ObjectId){
        return await this.eventModel.updateOne(
            { _id: {$eq: eventID}},
            { $push: { Requesters: userID } });
    }

    async getRequesters(eventID: Types.ObjectId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}},
            { Requesters: 1 })
    }

    async getPopulatedRequesters(eventID: Types.ObjectId, managerID: Types.ObjectId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}, Manager:{$eq: managerID}},
            { Requesters: 1 }).populate('Requesters');
    }

    async removeEventViewRequest(eventID: Types.ObjectId, userID: Types.ObjectId){
        return await this.eventModel.updateOne(
            {_id :{$eq: eventID}},
            { $pull: { Requesters: userID } });
    }
}