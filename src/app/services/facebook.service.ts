import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacebookAuthService {
  loginWithFacebook():  void {
    const clientId = '1416327096035564';
    const redirectUri = 'http://localhost:4200/facebook-callback'; //URL donde facebook redirige con el código
    const scope = 'email,public_profile';

    const url = `https://www.facebook.com/v18.0/dialog/oauth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&response_type=code`; //Se le pide a facebook un codigo de auorización

    window.location.href = url;
  }
}
