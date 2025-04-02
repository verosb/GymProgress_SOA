import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server'; //Activa SSR en angular 
import { provideServerRouting } from '@angular/ssr'; //Configura las rutas para que funcionencon SSR
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = { //se le indica que renderice la aplicacion en el servidor 
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig); //combina la configuracion normal de la app con la configuracion del servidor 


//SSR: las paginas se generan en el servidor antes de ser enviadas al navegador. 
//. La renderización es el proceso mediante el cual un código se convierte en una interfaz visual que el usuario puede
//  ver e interactuar en una aplicación o página web. En términos simples, es el proceso de transformar datos en elementos visibles en la pantalla.
