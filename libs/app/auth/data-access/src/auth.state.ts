// import { Injectable } from '@angular/core';
// import {
//   SocialUser,
// } from 'angularx-social-login';
// import {
//     ContinueWithGoogle,
//     Logout,
//     SetUser,
//     SubscribeToAuthState
// } from '@event-participation-trends/app/auth/util';
// import { SetError } from '@event-participation-trends/app/error/util';
// import { Navigate } from '@ngxs/router-plugin';
// import { Action, Selector, State, StateContext } from '@ngxs/store';
// import { produce } from 'immer';
// import { tap } from 'rxjs';
// import { AuthApi } from './auth.api';

// export interface AuthStateModel {
//   user: SocialUser | null;
// }

// @State<AuthStateModel>({
//   name: 'auth',
//   defaults: {
//     user: null,
//   },
// })
// @Injectable()
// export class AuthState {
//   constructor(private readonly authApi: AuthApi) {}

//   @Selector()
//   static user(state: AuthStateModel) {
//     return state.user;
//   }

//   @Action(SubscribeToAuthState)
//   public subscribeToAuthState(ctx: StateContext<AuthStateModel>) {
//     return this.authApi.auth$().pipe(
//       tap((user: SocialUser | null) => {
//         ctx.dispatch(new SetUser(user));
//       })
//     );
//   }

//   @Action(SetUser)
//   async setUser(ctx: StateContext<AuthStateModel>, { user }: SetUser) {
//     ctx.setState(
//       produce((draft) => {
//         draft.user = user;
//       })
//     );
//   }

//   @Action(ContinueWithGoogle)
//   async continueWithGoogle(ctx: StateContext<AuthStateModel>) {
//     try {
//       await this.authApi.continueWithGoogle();
//       return ctx.dispatch(new Navigate(['home']));
//     } catch (error) {
//       return ctx.dispatch(new SetError((error as Error).message));
//     }
//   }

//   @Action(Logout)
//   async logout(ctx: StateContext<AuthStateModel>) {
//     await this.authApi.logout();
//     return ctx.dispatch(new Navigate(['/']));
//   }
// }
