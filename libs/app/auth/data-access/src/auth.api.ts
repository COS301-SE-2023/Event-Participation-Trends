// import { Injectable } from '@angular/core';
// import {
//     SocialAuthService,
//     SocialUser,
//     GoogleLoginProvider
// } from 'angularx-social-login';
// import { tap } from 'rxjs';

// @Injectable()
// export class AuthApi {
//     constructor(private authService : SocialAuthService) {}

//     auth$() {
//         return this.authService.authState.pipe(
//             tap((user: SocialUser | null) => {
//                 return user;
//             })
//         );
//     }

//     async continueWithGoogle() : Promise<void>{
//         this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
//     }

//     async logout() : Promise<void> {
//         await this.authService.signOut();
//     }
// }