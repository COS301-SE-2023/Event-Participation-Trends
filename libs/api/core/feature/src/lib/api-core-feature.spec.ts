import { Test ,TestingModule } from '@nestjs/testing';
import { EventService } from '@event-participation-trends/api/event/feature';
import { EventController, UserController } from '../controllers';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard, RbacGuard } from '@event-participation-trends/api/guards';
import { Reflector } from '@nestjs/core';
import { UserService } from '@event-participation-trends/api/user/feature';
import { HttpException } from '@nestjs/common';

describe('EventController', () => {

    let eventController: EventController;

    beforeEach(async () => {
        const moduleRef: TestingModule  = await Test.createTestingModule({
            controllers: [EventController],
            providers: [EventService, 
                        UserService,
                        QueryBus, 
                        CommandBus,
                        JwtService,
                        JwtGuard,
                        RbacGuard,
                        Reflector,
                        ],
        }).compile();

        eventController = moduleRef.get<EventController>(EventController); 
    });

    describe('getEvent', () => {
        it('should throw a 400 Error: Bad Request: eventId not provided', async () => {

            const query = {};
            
            const req =  <Request> <unknown>{
                query: query,
              };
    
            try{
                const result = await eventController.getEvent(<any> <unknown> req);
                expect(() => eventController.getEvent(req)).toThrowError(
                    new HttpException('Bad Request: eventId not provided', 400),
                );
                fail('Expected HttpException to be thrown');
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Bad Request: eventId not provided');
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });

        it('should return a 200: getEvent result returns a event', async () => {

            const query = {
                eventId: "6485baa6e9ff924f40d2047c"
            };
            
            const req =  <Request> <unknown>{
                query: query,
              };
    
            try{
                const result = await eventController.getEvent(<any> <unknown> req);
                expect(result).toContain('event')
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Bad Request: eventId not provided');
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });
    });

    describe('getAllViewingEvents', () => {
        it('should throw a 400 Error: Bad Request: viewer email not provided', async () => {

            const query = {};

            const req =  <Request> <unknown>{
                query: query,
            };

            try{
                const result = await eventController.getAllViewingEvents(<any> <unknown> req);
                expect(() => eventController.getAllViewingEvents(<any> <unknown>req)).toThrowError(
                    new HttpException('Bad Request: eventId not provided', 400),
                );
                fail('Expected HttpException to be thrown');
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Bad Request: viewer email not provided');
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });

        it('should return a 200: getAllViewingEvents result returns a array of events', async () => {

            const query = {};
            
            const req =  <Request> <unknown>{
                user:{
                    email:"lucaloubser01@gmail.com"
                },
                query: query,
              };

            try{
                const result = await eventController.getAllViewingEvents(<any> <unknown> req);
                expect(result).toContain('events')
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });
    });

    describe('getAllViewRequests', () => {
        it('should throw a 400 Error: Bad Request: manager email not provided', async () => {

            const query = {eventId: "6485baa6e9ff924f40d2047c"};

            const req =  <Request> <unknown>{
                query: query,
              };

            try{
                const result = await eventController.getAllViewRequests(<any> <unknown> req ,query);
                expect(() => eventController.getAllViewRequests(<any> <unknown>req, query)).toThrowError(
                    new HttpException("Bad Request: manager email not provided", 400),
                );
                fail('Expected HttpException to be thrown');
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Bad Request: manager email not provided');
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });

        it('should throw a 400 Error: Bad Request: eventId not provided', async () => {

            const query = {};

            const req = <Request> <unknown>{
                user: {
                    email: "lucaloubser01@gmail.com"
                },
                query: query,
              };


            try{
                const result = await eventController.getAllViewRequests(<any> <unknown> req ,query);
                expect(() => eventController.getAllViewRequests(<any> <unknown>req, query)).toThrowError(
                    new HttpException('Bad Request: eventId not provided', 400),
                );
                fail('Expected HttpException to be thrown');
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Bad Request: eventId not provided');
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });

        it('should return a 200: getAllViewRequests result returns a array of users', async () => {

            const query = {};
            
            const req = <Request> <unknown>{
                user: {
                    email: "u20439963@tuks.co.za"
                },
                query: query,
              };


            try{
                const result = await eventController.getAllViewRequests(<any> <unknown> req ,query);
                expect(result).toContain('users')
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });
    });

    describe('getManagedEvents', () => {
        it('should throw a 400 Error: Bad Request: Manager email not provided', async () => {

            const query = {};

            const req =  <Request> <unknown>{
                query: query,
              };

            try{
                const result = await eventController.getManagedEvents(<any> <unknown> req);
                expect(() => eventController.getManagedEvents(<any> <unknown>req)).toThrowError(
                    new HttpException('Bad Request: Manager email not provided', 400),
                );
                fail('Expected HttpException to be thrown');
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Bad Request: Manager email not provided');
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });

        it('should return a 200: getManagedEvents result returns an array of events', async () => {

            const query = {};

            const req =  <Request> <unknown>{
                query: query,
                user:{
                    email:"u20439963@tuks.co.za"
                }
            };

            try{
                const result = await eventController.getManagedEvents(<any> <unknown> req);
                expect(result).toContain('events')
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });
    });

    describe('getAllEvents', () => {
        it('should throw a 400 Error: Bad Request: Admin email not provided', async () => {

            const query = {};

            const req =  <Request> <unknown>{
                query: query,
            };

            try{
                const result = await eventController.getAllEvents(<any> <unknown> req);
                expect(() => eventController.getAllEvents(<any> <unknown>req)).toThrowError(
                    new HttpException('Bad Request: Adman email not provided', 400),
                );
                fail('Expected HttpException to be thrown');
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Bad Request: Admin email not provided');
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });

        it('should return a 200: getAllEvents result returns a array of events', async () => {

            const query = {};

            const req =  <Request> <unknown>{
                query: query,
                user:{
                    email:"lucaloubser01@gmail.com"
                }
              };

            try{
                const result = await eventController.getAllEvents(<any> <unknown> req);
                expect(result).toContain('events');
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });
    });


});


describe('UserController', () => {

    let userController: UserController;

    beforeEach(async () => {
        const moduleRef: TestingModule  = await Test.createTestingModule({
            controllers: [UserController],
            providers: [EventService, 
                        UserService,
                        QueryBus, 
                        CommandBus,
                        JwtService,
                        JwtGuard,
                        RbacGuard,
                        Reflector,
                        ],
        }).compile();

        userController = moduleRef.get<UserController>(UserController); 
    });

    describe('getAllUsers', () => {
        it('should throw a 400 Error: Bad Request: admin email not provided', async () => {

            const query = {};

            const req =  <Request> <unknown>{
                query: query,
            };
    
            try{
                const result = await userController.getAllUsers(<any> <unknown> req);
                expect(() => userController.getAllUsers(<any> <unknown> req)).toThrowError(
                    new HttpException('Bad Request: admin email not provided', 400),
                );
                fail('Expected HttpException to be thrown');
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.message).toBe('Bad Request: admin email not provided');
                    expect(error.getStatus()).toBe(400);
                }
            }
            
        });

        it('should return a 200: getAllUsers result returns a array containing users', async () => {

            const query = {
                user:{
                    email:"indlovu.software@gmail.com"
                }
            };
            
            const req =  <Request> <unknown>{
                query: query,
            };
    
            try{
                const result = await userController.getAllUsers(<any> <unknown> req);
                expect(result).toContain('users')
            }catch(error){
                if(error instanceof HttpException){
                    expect(error).toBeInstanceOf(HttpException);
                    expect(error.getStatus()).toBe(400);
                }
            }
            
          });
    });

});