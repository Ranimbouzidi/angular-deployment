import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { GlobalHeaderComponent } from "../global-header/global-header.component";

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent implements OnInit {

  currentUser:User;

  constructor(private router:Router) { }

  ngOnInit(): void {

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    
    // if (isLoggedIn === null || role=="ADMIN") {
    //   this.router.navigate(['/']);
    // }
    if (isLoggedIn === 'true') {
     const userData = localStorage.getItem('currentUser');
     if (userData) {
       this.currentUser = JSON.parse(userData);
     }
     
     
    }


    
  }

  

  onLogout() {
  
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);

  
  }

}
