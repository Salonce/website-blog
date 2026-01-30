import { Component } from '@angular/core';
import { Dashboard } from './dashboard/dashboard';
import { RouterOutlet } from '@angular/router';
import { TopNavbar } from '../../../components/top-navbar/top-navbar';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, TopNavbar, Dashboard],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.css'
})
export class DashboardLayout {

}
