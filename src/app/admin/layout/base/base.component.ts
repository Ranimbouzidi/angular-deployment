import { Component, OnInit } from '@angular/core';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/UserService';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  
  
  isLoading: boolean;

  constructor(public userService:UserService ,private router: Router, private route: ActivatedRoute) { 

    // Spinner for lazyload modules
    router.events.forEach((event) => { 
      if (event instanceof RouteConfigLoadStart) {
        this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this.isLoading = false;
      }
    });

    
  }

  ngOnInit() {

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('currentUser');
    const role = localStorage.getItem('role');
    
     if (isLoggedIn === null) {
     this.router.navigate(['/']);
     }
    
  
   
  }

  

}
