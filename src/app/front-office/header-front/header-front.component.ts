import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header-front',
  templateUrl: './header-front.component.html',
  styleUrls: ['./header-front.component.css']
})
export class HeaderFrontComponent implements OnInit {
 currentUser:User;
 isMenuOpen =false;
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
    // Vérifier si l'utilisateur est sur la page des abonnements
    if (this.router.url.includes('/mes-abonnements')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      window.location.href = '/pricing'; // Utiliser window.location.href pour forcer la redirection
    } else {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    }
  }


  public isBasicExampleMenuCollapsed = true;
  

}


