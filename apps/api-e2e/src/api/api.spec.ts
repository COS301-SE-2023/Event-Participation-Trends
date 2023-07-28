/*
import axios from 'axios';
import { spawn } from 'child_process';

describe('GET /api', () => {
  let apiServer;
  beforeAll(async () => {
    axios.defaults.baseURL = 'http://localhost:3000';
    apiServer = spawn('yarn', ['start:dev'], {
      cwd: './',
      shell: true,
    });
    let notUp = true;
    while (notUp) {
      try {
        await axios.get('api/');
      } catch (error) {
        console.log(error);
        if (error?.response?.status === 401) {
          notUp = false;
        }
      }
    }
  }, 25000);

  let res;
  it('should return a message', async () => {
    try {
      res = await axios.get('api/');
    } catch (error) {
      expect(error.response.status).toEqual(401);
      return;
    }
  });

  afterAll(() => {
    apiServer.kill();
  });
});

*/
import {Test} from '@nestjs/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { AppModule } from '../../../../apps/api/src/app/app.module';
import { Types } from 'mongoose';
import request from 'supertest';
import { CsrfGuard, JwtGuard, RbacGuard } from '@event-participation-trends/api/guards';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { GlobalRepository } from '@event-participation-trends/api/global/data-access';
import { ICreateEventRequest, IEvent, IFloorLayout, IPosition, IViewEvent, Position } from '@event-participation-trends/api/event/util';
import { IUser, Role } from '@event-participation-trends/api/user/util';
import { ICreateGlobalRequest, IGlobal } from '@event-participation-trends/api/global/util';
import { promisify } from 'util';

//constants 
// eslint-disable-next-line prefer-const
let TEST_EVENT: IEvent ={
    StartDate: new Date("2023-06-10T12:34:56.789Z"),
    EndDate: new Date("2023-06-13T12:34:56.789Z"),
    Name: "Testing Event",
    Category: "Testing Category",
    Location: {
        Latitude: 0,
        Longitude: 0,
        StreetName: "None",
        CityName: "None",
        ProvinceName: "None",
        CountryName: "None",
        ZIPCode: "None"
    },
    Manager: new Types.ObjectId(),
    FloorLayout: null,
   // Devices: Array<Position>(),
}

const TEST_USER_1: IUser ={
    Email: process.env['TEST_USER_EMAIL_1'],
	FirstName: "None",
	LastName: "None",
	Role: process.env['TEST_USER_ROLE_1'],
    Viewing: new Array<Types.ObjectId>()
}

const TEST_USER_2: IUser ={
    Email: process.env['TEST_USER_EMAIL_2'],
	FirstName: "None",
	LastName: "None",
	Role: process.env['TEST_USER_ROLE_2'],
    Viewing: new Array<Types.ObjectId>()
}

const TEST_DEVICE_POSITION: IPosition ={
    id: 0,
    x: 0,
    y: 0,
    timestamp: new Date()
}

const TEST_GLOBAL: IGlobal ={
    SensorIdToMacs: [{
        eventSensorId: "test01",
        mac: "00:00:00:00:00:00"
    }]
}

const SLEEP = promisify(setTimeout);

//helper functions
function objectSubset(target: any, obj: any ): boolean{
		
	for(const element of obj){
		for (const key in target){
			// eslint-disable-next-line no-prototype-builtins
			if (target.hasOwnProperty(key)){
                // eslint-disable-next-line no-prototype-builtins
				if(target.hasOwnProperty(key) && element.hasOwnProperty(key)){
					if( element.key != target.key){
						return false;
                    }
                }else{
					return false;
                }
			}
				
		}
	}
	
	return true;
}

describe('GlobalController', ()=>{
    let moduleRef: any;
    let httpServer: any;
    let app: any;
    let globalRepository: GlobalRepository;

    beforeAll(async ()=>{
        process.env['ENVIRONMENT'] = "test";  

        moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
        .overrideGuard(JwtGuard)
        .useValue({ canActivate: (context) => {
            context.switchToHttp().getRequest().user = { email: process.env['TEST_USER_EMAIL_1'] };
            return true;
        } })
        .overrideGuard(RbacGuard)
        .useValue({ canActivate: () => true })
        .overrideGuard(CsrfGuard)
        .useValue({ canActivate: () => true })
        .compile();

        app = moduleRef.createNestApplication();
        await app.init();

        httpServer = app.getHttpServer();

        globalRepository = moduleRef.get(GlobalRepository);
    })

    afterAll(async ()=>{
        //process.env['ENVIRONMENT'] = "development";
        await app.close();
    })
    
    describe('getGlobal', ()=>{
        it('Should return an array of eventSensorId and macs pairs', async ()=>{
            await globalRepository.createGlobal(TEST_GLOBAL); 

            const response = await request(httpServer).get("/global/getGlobal?sensorIdToMacs='true'");

            expect(response.status).toBe(200);
            expect(response.body.sensorIdToMacs).toEqual(TEST_GLOBAL.SensorIdToMacs);

            //cleanup
            await globalRepository.deleteGlobal();
        })  
    })

    describe('createGlobal', ()=>{
        it('Should set a global object in the database', async ()=>{
            const expectedRequest: ICreateGlobalRequest ={
                sensorIdToMacs: TEST_GLOBAL.SensorIdToMacs
            };

            const response = await request(httpServer).post("/global/createGlobal").send(expectedRequest);
            expect(response.body.status).toEqual("success");

            //due to delayed persistance wait
            let global = await globalRepository.getGlobal();
            while(global.length == 0){
                global = await globalRepository.getGlobal();
                await SLEEP(500);
            }

            const res = objectSubset(expectedRequest.sensorIdToMacs[0],[global[0].SensorIdToMacs[0]]);
            expect(res).toBe(true);

            //cleanup
            await globalRepository.deleteGlobal();
        })  
    })

});

describe('EventController', ()=>{
    let moduleRef: any;
    let httpServer: any;
    let app: any;
    let eventRepository: EventRepository;
    let userRepository: UserRepository;

    beforeAll(async ()=>{
        process.env['ENVIRONMENT'] = "test";  

        moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
        .overrideGuard(JwtGuard)
        .useValue({ canActivate: (context) => {
            context.switchToHttp().getRequest().user = { email: process.env['TEST_USER_EMAIL_1'] };
            return true;
        } })
        .overrideGuard(RbacGuard)
        .useValue({ canActivate: () => true })
        .overrideGuard(CsrfGuard)
        .useValue({ canActivate: () => true })
        .compile();

        app = moduleRef.createNestApplication();
        await app.init();

        httpServer = app.getHttpServer();

        eventRepository = moduleRef.get(EventRepository);
        userRepository = moduleRef.get(UserRepository);
    })

    afterAll(async ()=>{
        //process.env['ENVIRONMENT'] = "development";
        await app.close();
    })

    describe('getEvent', ()=>{
        it('Should return an event object', async ()=>{
            await eventRepository.createEvent(TEST_EVENT); 
            const event = await eventRepository.getEventByName(TEST_EVENT.Name);

            const response = await request(httpServer).get(`/event/getEvent?eventId=${event[0]._id}`);

            expect(response.status).toBe(200);
            const res = objectSubset(TEST_EVENT,[response.body.event]);
            expect(res).toBe(true);

            //cleanup
            await eventRepository.deleteEventbyId(event[0]._id)
        })  
    })
   
    describe('getAllEvents',  ()=>{
        it('Should return an array of events', async ()=>{
            await eventRepository.createEvent(TEST_EVENT); 
            const event = await eventRepository.getEventByName(TEST_EVENT.Name);

            const response = await request(httpServer).get('/event/getAllEvents');

            expect(response.status).toBe(200);
            const res = objectSubset(TEST_EVENT,response.body.events);
            expect(res).toBe(true);

            //cleanup
            await eventRepository.deleteEventbyId(event[0]._id)
        })  
    })
 
    describe('getManagedEvents',  ()=>{
        it('Should return an array of events', async ()=>{
            await userRepository.createUser(TEST_USER_1);
            
            const user = await userRepository.getUser(process.env['TEST_USER_EMAIL_1']);
            TEST_EVENT.Manager = user[0]._id;
            
            await eventRepository.createEvent(TEST_EVENT);
            const event = await eventRepository.getEventByName(TEST_EVENT.Name);

            const response = await request(httpServer).get('/event/getManagedEvents');

            expect(response.status).toBe(200);
            const res = objectSubset(TEST_EVENT,response.body.events);
            expect(res).toBe(true);

            //cleanup
            await userRepository.deleteUserById(user[0]._id);
            await eventRepository.deleteEventbyId(event[0]._id);
        })
    })

    describe('getAllViewRequests',  ()=>{
        it('Should return an array of Requesters', async ()=>{
            //create event manager and event
            await userRepository.createUser(TEST_USER_1);
            const manager = await userRepository.getUser(process.env['TEST_USER_EMAIL_1']);
            TEST_EVENT.Manager = manager[0]._id;

            await eventRepository.createEvent(TEST_EVENT); 
            const event = await eventRepository.getEventByName(TEST_EVENT.Name);

            //create event viewer
            await userRepository.createUser(TEST_USER_2);
            const viewer = await userRepository.getUser(process.env['TEST_USER_EMAIL_2']);

            await eventRepository.createViewRequest(viewer[0]._id,event[0]._id);
            
            //test endpoint
            const response = await request(httpServer).get(`/event/getAllViewRequests?eventId=${event[0]._id}`);            

            expect(response.status).toBe(200);
            const res = objectSubset(TEST_USER_2,response.body.users[0].Requesters);
            expect(res).toBe(true);

            //cleanup
            await userRepository.deleteUserById(manager[0]._id);
            await userRepository.deleteUserById(viewer[0]._id);
            await eventRepository.deleteEventbyId(event[0]._id);
        })
    })

    describe('getAllViewingEvents',  ()=>{
        it('Should return an array of events', async ()=>{

            const moduleRef = await Test.createTestingModule({
                imports: [AppModule],
            })
            .overrideGuard(JwtGuard)
            .useValue({
            canActivate: (context) => {
                context.switchToHttp().getRequest().user = {
                email: process.env['TEST_USER_EMAIL_2'],
                };
                return true;
            },
            })
            .overrideGuard(RbacGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(CsrfGuard)
            .useValue({ canActivate: () => true })
            .compile();

            // Get the NestJS application instance and HTTP server
            const app = moduleRef.createNestApplication();
            await app.init();
            const httpServer = app.getHttpServer();

            //create manager
            await userRepository.createUser(TEST_USER_1);
            const manager = await userRepository.getUser(process.env['TEST_USER_EMAIL_1']);
            TEST_EVENT.Manager = manager[0]._id;
    
            //create event
            await eventRepository.createEvent(TEST_EVENT);
            const event = await eventRepository.getEventByName(TEST_EVENT.Name);
    
            //create viewer
            await userRepository.createUser(TEST_USER_2);
            const viewer = await userRepository.getUser(process.env['TEST_USER_EMAIL_2']);
            
            await userRepository.addViewingEvent(viewer[0]._id, event[0]._id);
    
            const response = await request(httpServer).get('/event/getAllViewingEvents');
    
            expect(response.status).toBe(200);
            const res = objectSubset(TEST_EVENT,response.body.events);
            expect(res).toBe(true);
    
            //cleanup
            await userRepository.deleteUserById(viewer[0]._id);
            await userRepository.deleteUserById(manager[0]._id);
            await eventRepository.deleteEventbyId(event[0]._id);

            await app.close();
        })
    })

    describe('getEventFloorLayout', ()=>{
        it('Should return an string represention of a FloorLayout', async ()=>{
            await eventRepository.createEvent(TEST_EVENT); 
            const event = await eventRepository.getEventByName(TEST_EVENT.Name);

            await eventRepository.updateEventFloorlayout(event[0]._id,"Test Floor Layout");

            const response = await request(httpServer).get(`/event/getEventFloorLayout?eventId=${event[0]._id}`);

            expect(response.status).toBe(200);
            expect(response.body.floorlayout).toEqual("Test Floor Layout");

            //cleanup
            await eventRepository.deleteEventbyId(event[0]._id)
        })  
    })

    describe('getEventDevicePosition', ()=>{
        it('Should return an array of positions', async ()=>{
            await eventRepository.createEvent(TEST_EVENT); 
            const event = await eventRepository.getEventByName(TEST_EVENT.Name);
            await eventRepository.addDevicePosition(event[0]._id, [TEST_DEVICE_POSITION]);

            const startTime = (new Date(TEST_DEVICE_POSITION.timestamp.setHours(TEST_DEVICE_POSITION.timestamp.getHours() -4))).toString();
            const endTime = (new Date(TEST_DEVICE_POSITION.timestamp.setHours(TEST_DEVICE_POSITION.timestamp.getHours() +6))).toString();
            const eventId = <string> <unknown> (event[0]._id);

            const URI='/event/getEventDevicePosition?eventId='+eventId+'&startTime="'+startTime+'"&endTime="'+endTime+'"';

            const response = await request(httpServer).get(URI);

            expect(response.status).toBe(200);
            const res = objectSubset(TEST_DEVICE_POSITION,response.body.positions);
            expect(res).toBe(true);

            //cleanup
            await eventRepository.deleteEventbyId(event[0]._id)
        })  
    })

    describe('getAllEventCategories', ()=>{
        it('Should return an array of categories', async ()=>{
            await eventRepository.createEvent(TEST_EVENT); 
            const event = await eventRepository.getEventByName(TEST_EVENT.Name);

            const response = await request(httpServer).get("/event/getAllEventCategories");

            expect(response.status).toBe(200);
            expect(response.body.categories[0]).toBe(TEST_EVENT.Category);

            //cleanup
            await eventRepository.deleteEventbyId(event[0]._id)
        })  
    })

    describe('createEvent', ()=>{
        it('Should create an event in the Database', async ()=>{
            //create event manager and event
            await userRepository.createUser(TEST_USER_1);
            const manager = await userRepository.getUser(process.env['TEST_USER_EMAIL_1']);
            TEST_EVENT.Manager = manager[0]._id;

            const response = await request(httpServer).post("/event/createEvent").send(TEST_EVENT);
            expect(response.body.status).toEqual("success");

            //due to delayed persistance wait
            let event = await eventRepository.getEventByName(TEST_EVENT.Name);
            while(event.length == 0){
                event = await eventRepository.getEventByName(TEST_EVENT.Name);
                await SLEEP(50);
            }

            //due to async have to unwrap
            const temp: IEvent = {
                StartDate: event[0].StartDate,
                EndDate: event[0].EndDate,
                Name: event[0].Name,
                Category: event[0].Category,
                Location: event[0].Location,
                Manager: event[0].Manager,
                FloorLayout: <IFloorLayout> {JSON_DATA: event[0].FloorLayout},
            }

            const res = objectSubset(TEST_EVENT,[temp]);
            expect(res).toBe(true);

            //cleanup
            await eventRepository.deleteEventbyId(event[0]._id);
            await userRepository.deleteUserById(manager[0]._id);
        })  
    })


})

describe('UserController', ()=>{
    let httpServer: any;
    let app: any;
    let userRepository: UserRepository;

    beforeAll(async ()=>{

        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
        .overrideGuard(JwtGuard)
        .useValue({ canActivate: (context) => {
            context.switchToHttp().getRequest().user = { email: process.env['ADMIN_EMAIL'] };
            return true;
        } })
        .overrideGuard(RbacGuard)
        .useValue({ canActivate: () => true })
        .overrideGuard(CsrfGuard)
        .useValue({ canActivate: () => true })
        .compile();

        app = moduleRef.createNestApplication();
        await app.init();

        httpServer = await app.getHttpServer();

        userRepository = await moduleRef.get(UserRepository);
    })

    afterAll(async ()=>{
        //process.env['ENVIRONMENT'] = "development";
        await app.close();
    })
    
    describe('getAllUsers', ()=>{
        it('Should return an array of Users', async ()=>{
            await userRepository.createUser(TEST_USER_2); 
            const user = await userRepository.getUser(process.env['TEST_USER_EMAIL_2']);

            const response = await request(httpServer).get("/user/getAllUsers");

            expect(response.status).toBe(200);
            const res = objectSubset(TEST_USER_2,response.body.users);
            expect(res).toBe(true);

            //cleanup
            await userRepository.deleteUserById(user[0]._id)
        })  
    })

    describe('updateUserRole', ()=>{
        it('Should update user role', async ()=>{
            
            const moduleRef = await Test.createTestingModule({
                imports: [AppModule],
            })
            .overrideGuard(JwtGuard)
            .useValue({
                canActivate: (context) => {
                context.switchToHttp().getRequest().user = {
                email: process.env['ADMIN_EMAIL'],
                };
                return true;
            },
            })
            .overrideGuard(RbacGuard)
            .useValue({ canActivate: () => true })
            .overrideGuard(CsrfGuard)
            .useValue({ canActivate: () => true })
            .compile();

            // Get the NestJS application instance and HTTP server
            const app = moduleRef.createNestApplication();
            await app.init();
            const httpServer = app.getHttpServer();

            await userRepository.createUser(TEST_USER_2); 

            const requestObj= {
                update: {
                    UserEmail: process.env['TEST_USER_EMAIL_2'],
                    UpdateRole: Role.MANAGER,
                }
            }

            const response = await request(httpServer).post("/user/updateUserRole").send(requestObj);
            expect(response.body.status).toEqual("success");

            const user = await userRepository.getUser(process.env['TEST_USER_EMAIL_2']);
            
            //delayed persistence has posiblilty that not immedietly changed in DB hence wait
            if(user[0].Role != Role.MANAGER)
                await SLEEP(1000);

            expect(user[0].Role).toBe(Role.MANAGER);

            //cleanup
            await userRepository.deleteUserById(user[0]._id);
            await app.close();
        })  
    })
    
});
