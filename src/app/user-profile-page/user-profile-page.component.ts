import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.scss']
})
export class UserProfilePageComponent implements OnInit {

  candidateId: number;
  currentUser:User;
  constructor(private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit() {

    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
      const candidateData = localStorage.getItem('currentUser');
      if (candidateData) {
        this.currentUser = JSON.parse(candidateData);
      }
      
      
     }
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
     
    }
  }
}
