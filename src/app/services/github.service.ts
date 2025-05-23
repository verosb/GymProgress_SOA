import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubAuthService  {
  loginWithGithub(): void {
    const clientId = 'CLIENT_ID';
    const redirectUri = 'http://localhost:4200/github-callback';
    const scope = 'read:user user:email';

    const url = `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}`;

    window.location.href = url;
  }
}
