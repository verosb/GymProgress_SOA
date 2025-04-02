import { Injectable } from '@angular/core';
import axios from 'axios'; //Libreria para hacer peticiones HTTP al backend 

@Injectable({
  providedIn: 'root', 
})
export class AuthService {
  private readonly registerURL = 'http://localhost:8080/api/users'; 

  async registerUser(userData: any): Promise<any> {
    try {
      const response = await axios.post(this.registerURL, userData);
      console.log('Datos enviados desde el service (frontend)');
      return response.data;
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  private readonly loginUrl = 'http://localhost:8080/api/users/login';

  async loginUser(userDataLogin: any): Promise<any> {
    try {
      const response = await axios.post(this.loginUrl, userDataLogin);
      return response.data;
    } catch (error) {
      console.log('Error de login.service: ', error);
    }
  }
}
