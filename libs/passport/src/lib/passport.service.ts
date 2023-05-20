import { Injectable } from '@nestjs/common';

@Injectable()
export class PassportService {
    googleLogin(req: any){
        if(!req.user){
            return 'No user from google'
        }
        return {
            message: 'User information from google',
            user: req.user,
        }
    }
}
