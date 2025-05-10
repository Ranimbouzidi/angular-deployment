import { Component, OnInit } from '@angular/core';
import { AiDashboardService } from '../services/ai-dashboard.service';
import { AnalysisDashboardDTO } from '../models/ai.models';
import { Pack } from '../models/pack';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.Scss']
})
export class AdminDashboardComponent implements OnInit {
  dashboardData!: AnalysisDashboardDTO;
 abonnements: Pack[] = [];
  constructor(private aiDashboardService: AiDashboardService) {}

  ngOnInit(): void {
    this.aiDashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
      },
      error: (err) => {
        console.error('Erreur chargement dashboard', err);
      }
    });
  }
}
