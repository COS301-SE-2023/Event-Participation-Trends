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
import { Connection, Types } from 'mongoose';
import { DatabaseService } from '@event-participation-trends/api/database/feature';
import request from 'supertest';
import { CsrfGuard, JwtGuard, RbacGuard } from '@event-participation-trends/api/guards';
import { EventRepository } from '@event-participation-trends/api/event/data-access';
import { UserRepository } from '@event-participation-trends/api/user/data-access';
import { IEventDetails } from '@event-participation-trends/api/event/util';
import { IUser } from '@event-participation-trends/api/user/util';

//constants 
// eslint-disable-next-line prefer-const
let TEST_EVENT: IEventDetails ={
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
    Manager: new Types.ObjectId()
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


//helper functions
function objectSubset(target: any, obj: any ): boolean{
	for(const element of obj){
		for (const key in target) 
			// eslint-disable-next-line no-prototype-builtins
			if ((target.hasOwnProperty(key) && element.hasOwnProperty(key) && element.key == target.key)) 
				return true;
	}
    return false;
}

describe('UserController',()=>{
    let connection: Connection;
    let httpServer: any;
    let app: any;
    let eventRepository: EventRepository;
    let userRepository: UserRepository;

    beforeAll(async ()=>{
        process.env['NODE_ENV'] = "test";  

        const moduleRef = await Test.createTestingModule({
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

        connection = moduleRef.get(DatabaseService).getConnection();
        httpServer = app.getHttpServer();

        eventRepository = moduleRef.get(EventRepository);
        userRepository = moduleRef.get(UserRepository);
    })

    afterAll(async ()=>{
        process.env['NODE_ENV'] = "development";
        await app.close();
    })

    describe('getAllEvents', ()=>{
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

    describe('getManagedEvents', ()=>{
        it('Should return an array of events', async ()=>{
            await userRepository.createUser(TEST_USER_1);
            
            const user = await userRepository.getUser(process.env['TEST_USER_EMAIL_1']);
            TEST_EVENT.Manager = user[0]._id;
            
            await eventRepository.createEvent(TEST_EVENT);
            const response = await request(httpServer).get('/event/getManagedEvents');

            expect(response.status).toBe(200);
            const res = objectSubset(TEST_EVENT,response.body.events);
            expect(res).toBe(true);
        })
    })

    describe('getAllViewRequests', ()=>{
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

})