import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/UserService';
import { Pack } from '../models/pack';
import { PacksService } from '../services/packs.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss',
    
  ]
})
export class HomeComponent implements OnInit {

  abonnements: Pack[] = [];
   filteredAbonnements : Pack[];
   abonnementTypeFilter : string = '';
   jobExperienceFilter : string = '';
   nomFilter = '';
 lieuFilter = '';
 
   constructor(public packService:PacksService) { }
 
   ngOnInit(): void {
     this.packService.getAllPacks().subscribe(
       (abonnements: Pack[]) => {
         this.abonnements = abonnements;
         this.filteredAbonnements = abonnements;
    
       }
     );
   }
 
 
 
   
   onSubmit() {
  
 
   }
 }
 