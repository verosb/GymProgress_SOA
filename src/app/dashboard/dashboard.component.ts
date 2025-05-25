import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import NavComponent from '../components/nav/nav.component';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, NavComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export default class DashboardComponent {

}
