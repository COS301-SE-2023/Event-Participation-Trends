import { Injectable } from '@angular/core';
// import { ContinueWithGoogle as AuthContinueWithGoogle} from '@event-participation-trends/app/auth/util';
import { ContinueWithGoogle } from '@event-participation-trends/app/login/util';
import { SetError } from '@event-participation-trends/app/error/util';
import { Action, State, StateContext } from '@ngxs/store';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginStateModel {}

@State<LoginStateModel>({
    name: 'login'
})

@Injectable()
export class LoginState {
    
    // @Action(ContinueWithGoogle)
    // async continueWithGoogle(ctx: StateContext<LoginStateModel>) {
    //     try {
    //     return ctx.dispatch(new AuthContinueWithGoogle());
    //     } catch (error) {
    //     return ctx.dispatch(new SetError((error as Error).message));
    //     }
    // }
}