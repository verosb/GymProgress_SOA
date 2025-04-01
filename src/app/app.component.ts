import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; //muestra diferentes vistas segun la ruta 

//Componente principal de la aplicacion angular
//Punto de entrada que carga y organiza el resto de componentes en la pantalla 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html', //enlaza el archivo que contiene la estructura del componente html
  styleUrl: './app.component.css',
})
export class AppComponent { //clase del componente principal 
  title = 'Gimnasio';
}



