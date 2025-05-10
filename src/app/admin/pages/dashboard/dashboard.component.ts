import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../models/user';
import { UserService } from '../../../services/UserService';
import { PacksService } from '../../../services/packs.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  preserveWhitespaces: true
})
export class DashboardComponent implements OnInit {
  users: User[];
  usersLength: number;
  adminsLength: number;
  packsLength: number;
  filteredUsers: User[] = [];

  /**
   * NgbDatepicker
   */
  currentDate: NgbDateStruct;

  constructor(
    public userService: UserService,
    private packService: PacksService,
    private router: Router) { }

  ngOnInit(): void {



    this.userService.getUsersLength().subscribe(length => {
      this.usersLength = length;
    });


    this.packService.getAllPacks().subscribe(packs => {
      this.packsLength = packs.length;
    });
   this.userService.getAdminLength().subscribe(length => {
     this.adminsLength = length;});






  }







}






