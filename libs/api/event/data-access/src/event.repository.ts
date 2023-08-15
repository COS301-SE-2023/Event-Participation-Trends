import { Injectable } from '@nestjs/common';
import { IEventDetails, IEventId, IStall, Position } from '@event-participation-trends/api/event/util';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Event,
         Sensor,
         Stall,
} from '../schemas';
import { Types } from 'mongoose';

@Injectable()
export class EventRepository {
    constructor(
        @InjectModel(Event.name) private eventModel: mongoose.Model<Event>,
        @InjectModel(Sensor.name) private sensorModel: mongoose.Model<Sensor>,
        @InjectModel(Stall.name) private stallModel: mongoose.Model<Stall>,
    ){}

    async createEvent(event: IEventDetails){
        await this.eventModel.create(event);
    }   

    async getAllEvents(){
        return await this.eventModel.find().select("-Devices");
    }

    async getManager(eventID: Types.ObjectId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}},
            { Manager: 1 })
    }

    async getAllActiveEvents(){
        const currDate = new Date();
        return await this.eventModel.find(
            {EndDate: {$gt: currDate}}).select("-Devices");
    }

    async getEventByName(eventName: string){
        return await this.eventModel.find(
            {Name: {$eq: eventName}}).select("-Devices");
    }

    async getEventByNameVerbose(eventName: string){
        return await this.eventModel.find(
            {Name: {$eq: eventName}});
    }

    async getEventById(eventID: Types.ObjectId){
        return await this.eventModel.find(
            {_id: {$eq: eventID}}).select("-Devices");
    }

    async getManagedEvents(managerID: Types.ObjectId){
        return await this.eventModel.find(
            {Manager: {$eq: managerID}}).select("-Devices");
    }

    async createViewRequest(userID: Types.ObjectId, eventID: Types.ObjectId){
        return await this.eventModel.updateOne(
            { _id: {$eq: eventID}},
            { $addToSet: { Requesters: userID } });
    }

    async addViewer(userID: Types.ObjectId, eventID: Types.ObjectId){
        return await this.eventModel.updateOne(
            { _id: {$eq: eventID}},
            { $addToSet: { Viewers: userID } });
    }

    async getRequesters(eventID: Types.ObjectId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}},
            { Requesters: 1 })
    }

    async getViewers(eventID: Types.ObjectId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}},
            { Viewers: 1 })
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

    async removeViewer(eventID: Types.ObjectId, userID: Types.ObjectId){
        return await this.eventModel.updateOne(
            {_id :{$eq: eventID}},
            { $pull: { Viewers: userID } });
    }

    async updateEventStartDate(eventID: Types.ObjectId, startDate: Date){
        return await this.eventModel.updateOne(
            {_id :{$eq: eventID}},
            {$set: {StartDate :startDate}})
    }

    async updateEventEndDate(eventID: Types.ObjectId, endDate: Date){
        return await this.eventModel.updateOne(
        {_id :{$eq: eventID}},
        {$set: {EndDate :endDate}})
    }

    async updateEventName(eventID: Types.ObjectId, name: string){
        return await this.eventModel.updateOne(
        {_id :{$eq: eventID}},
        {$set: {Name :name}})
    }

    async updateEventCategory(eventID: Types.ObjectId, category: string){
        return await this.eventModel.updateOne(
        {_id :{$eq: eventID}},
        {$set: {Category :category}})
    }

    async updateEventLocation(eventID: Types.ObjectId, location: string){
        return await this.eventModel.updateOne(
        {_id :{$eq: eventID}},
        {$set: {Location :location}})
    }
    
    async updateEventFloorlayout(eventID: Types.ObjectId, floorlayout: string){
        return await this.eventModel.updateOne(
        {_id :{$eq: eventID}},{$set: {FloorLayout :floorlayout}})
    }

    async updateEventVisibility(eventID: Types.ObjectId, visibility: boolean){
        return await this.eventModel.updateOne(
        {_id :{$eq: eventID}},{$set: {PublicEvent :visibility}})
    }

    async getALLEventNames(){
        return await this.eventModel.find({ Name: 1 });
    }

    async getPopulatedEventById(eventID: Types.ObjectId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}}).select("-Devices");
    }

    async getAllEventStalls(eventID: IEventId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}}, {Stalls: 1});
    }

    async createStall(stall: IStall){
        await this.stallModel.create(stall);
        return await this.eventModel.updateOne(
            {_id :{$eq: stall.EventId}},
            { $push: { Stalls: stall } });
    }

    async getStallByName(eventID: Types.ObjectId, stallName: string){
        return await this.stallModel.find(
            {Event: {$eq: eventID}, 
            Name: {$eq: stallName}});
    }

    async getAllStallNames(eventID: IEventId){
        return await this.stallModel.find({Event: {$eq: eventID}}, {Name: 1});
    }

    async updateStallName(eventID: IEventId, stall: IStall){
        return await this.stallModel.updateOne(
            {Event: {$eq: eventID}, Name: {$eq: stall.Name}},
            { $set: { Name: stall.Name } });
    }

    async updateStallXCoordinate(eventID: IEventId, stall: IStall){
        return await this.stallModel.updateOne(
            {Event: {$eq: eventID}, Name: {$eq: stall.Name}},
            { $set: { XCoordinate: stall.x_coordinate } });
    }

    async updateStallYCoordinate(eventID: IEventId, stall: IStall){
        return await this.stallModel.updateOne(
            {Event: {$eq: eventID}, Name: {$eq: stall.Name}},
            { $set: { YCoordinate: stall.y_coordinate } });
    }

    async updateStallWidth(eventID: IEventId, stall: IStall){
        return await this.stallModel.updateOne(
            {Event: {$eq: eventID}, Name: {$eq: stall.Name}},
            { $set: { Width: stall.width } });
    }

    async updateStallHeight(eventID: IEventId, stall: IStall){
        return await this.stallModel.updateOne(
            {Event: {$eq: eventID}, Name: {$eq: stall.Name}},
            { $set: { Height: stall.height } });
    }

    async removeStall(eventID: IEventId, stallName: string){
        return await this.stallModel.deleteOne(
            {Event: {$eq: eventID}, Name: {$eq: stallName}});
    }

    async getEventFloorlayout(eventID: Types.ObjectId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}},
            { FloorLayout: 1 })
    }

    async addDevicePosition(eventID: Types.ObjectId, position: Position[]){
        return await this.eventModel.updateOne(
            { _id: {$eq: eventID}},
            { $push: { Devices: { $each: position } } });
    }

    async getDevicePosotions(eventID: Types.ObjectId){
        return await this.eventModel.find(
            {_id :{$eq: eventID}},
            { Devices: 1 })
    }

    async getAllEventCategories(){
        return await this.eventModel.find().select("Category").distinct("Category");
    }

    async deleteEventbyId(eventId: Types.ObjectId){
        return await this.eventModel.deleteOne(
            {_id :{$eq: eventId}})
    }

    async getManagedEventCategories(managerID: Types.ObjectId){
        return await this.eventModel.find(
            {Manager: {$eq: managerID}}).select("Category").distinct("Category");
    }
}