import { ApplicationConfig, importProvidersFrom } from '@angular/core'; 
import { provideRouter } from '@angular/router';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { routes } from './app.routes';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { initializeApp } from 'firebase/app'; //inicializacion de firebase 

initializeApp(environment.firebase);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      HttpClientModule,
      AngularFireModule.initializeApp(environment.firebase),
      AngularFirestore
    ),
  ],
};
