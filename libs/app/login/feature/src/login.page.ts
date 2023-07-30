import { Component } from '@angular/core';
import { ContinueWithGoogle } from '@event-participation-trends/app/login/util';
import { Store } from '@ngxs/store';
import { timeout } from 'rxjs';

@Component({
  selector: 'event-participation-trends-login',
  templateUrl: './login.page.html',
  // styleUrls: ['./login.page.css'],
})
export class LoginPage {
  constructor(private readonly store: Store) {}

  continueWithGoogle() {
    const mouseTarget = document.querySelector("#google-login-button");

    mouseTarget?.classList.add("hover:scale-90");
    setTimeout(() => {
      mouseTarget?.classList.remove("hover:scale-90");
    }, 100);

    this.store.dispatch(new ContinueWithGoogle());

  }
}
