export class SubscribeToAuthState {
    static readonly type = '[Auth] SubscribeToAuthState';
}
  
// export class SetUser {
//     static readonly type = '[Auth] SetUser';
//     constructor(public readonly user: User | null) {}
// }

export class ContinueWithGoogle {
    static readonly type = '[Auth] ContinueWithGoogle';
  }
  
export class Logout {
    static readonly type = '[Auth] Logout';
}