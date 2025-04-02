import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

//Este archivo configura la pre-renderización en Angular SSR, asegurando que todas las rutas generen
//  HTML estático en el servidor antes de ser entregadas al usuario.
//Es importante en aplicaciones que usan Server-Side Rendering (SSR) para mejorar el rendimiento 
