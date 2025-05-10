import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss']
})
export class GlobalHeaderComponent implements OnInit {

  currentUser:User;


  @ViewChild('Events') EventsBloc: ElementRef;

  scrollToEvents() {
    this.EventsBloc.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  @ViewChild('Services') ServicesBloc: ElementRef;

  scrollToServices() {
    this.ServicesBloc.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  constructor( private router: Router) { }

  ngOnInit(): void {

    

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    isLoggedIn === 'true';
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


  public isBasicExampleMenuCollapsed = true;

}
