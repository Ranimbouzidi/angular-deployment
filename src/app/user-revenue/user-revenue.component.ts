import { Component, OnInit } from '@angular/core';
import { RevenueService, RevenuePredictionResponse } from '../services/revenue.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-revenue',
  templateUrl: './user-revenue.component.html',
  styleUrls: ['./user-revenue.component.scss']
})
export class UserRevenueComponent implements OnInit {
  revenueData: RevenuePredictionResponse | null = null;
  userId!: number;
  errorMessage: string | null = null;
  isLoading: boolean = true;
  userRole: string | null = null;

  constructor(private revenueService: RevenueService) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const userData = localStorage.getItem('currentUser');
    console.log('Données utilisateur du localStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('Utilisateur parsé:', user);
        
        if (user && user.id) {
          this.userId = user.id;
          this.userRole = user.role;
          console.log('ID utilisateur récupéré:', this.userId);
          console.log('Rôle utilisateur:', this.userRole);
          
          // Vérifier si l'utilisateur a le droit d'accéder aux revenus
          if (this.userRole !== 'ADMIN' && this.userRole !== 'CLIENT') {
            this.errorMessage = 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.';
            this.isLoading = false;
            return;
          }
          
          this.getUserRevenue();
        } else {
          this.errorMessage = 'ID utilisateur non trouvé dans les données';
          this.isLoading = false;
          console.error('Structure des données utilisateur incorrecte:', user);
        }
      } catch (error) {
        this.errorMessage = 'Erreur lors de la lecture des données utilisateur';
        this.isLoading = false;
        console.error('Erreur de parsing des données utilisateur:', error);
      }
    } else {
      this.errorMessage = 'Utilisateur non connecté';
      this.isLoading = false;
      console.error('Aucune donnée utilisateur trouvée dans le localStorage');
    }
  }

  getUserRevenue(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    if (!this.userId || isNaN(this.userId)) {
      this.errorMessage = 'ID utilisateur invalide';
      this.isLoading = false;
      return;
    }

    this.revenueService.getRevenuePrediction(this.userId).subscribe({
      next: (data) => {
        this.revenueData = data;
        this.isLoading = false;
        console.log('📊 Revenus récupérés avec succès:', data);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        console.error('Erreur détaillée:', error);
        
        if (error.status === 0) {
          this.errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d\'exécution.';
        } else if (error.status === 404) {
          this.errorMessage = 'L\'endpoint des revenus n\'existe pas. Vérifiez que l\'URL est correcte.';
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Vous n\'êtes pas autorisé à accéder à ces données. Vérifiez que vous avez les permissions nécessaires.';
        } else {
          this.errorMessage = `Erreur lors de la récupération des revenus (${error.status}): ${error.message}`;
        }
      }
    });
  }

  getWidth(value: number): number {
    if (!this.revenueData) return 0;
    
    const max = Math.max(
      this.revenueData.totalRevenueLast30Days,
      this.revenueData.totalRevenuePrevious30Days,
      this.revenueData.predictedRevenueNext30Days
    );
    return max > 0 ? (value / max) * 100 : 0;
  }

  getTrendEmoji(tendance: string): string {
    switch(tendance.toLowerCase()) {
      case 'hausse':
        return '↑';
      case 'baisse':
        return '↓';
      case 'stable':
        return '→';
      default:
        return '=';
    }
  }

  getGrowthEmoji(growthRate: number): string {
    if (growthRate > 10) return '↑↑';
    if (growthRate > 5) return '↑';
    if (growthRate > 0) return '↗';
    if (growthRate < -10) return '↓↓';
    if (growthRate < -5) return '↓';
    if (growthRate < 0) return '↘';
    return '→';
  }

  getEncouragementMessage(): string {
    if (!this.revenueData) return '';

    const growthRate = this.revenueData.growthRate;
    const currentRevenue = this.revenueData.totalRevenueLast30Days;
    const predictedRevenue = this.revenueData.predictedRevenueNext30Days;

    if (growthRate > 20) {
      return '🎉 Excellente progression ! Votre croissance est impressionnante.';
    } else if (growthRate > 10) {
      return '🌟 Superbe performance ! Continuez sur cette lancée.';
    } else if (growthRate > 0) {
      return '📈 Votre activité est en hausse, c\'est encourageant !';
    } else if (growthRate === 0) {
      return '⚖️ Votre activité est stable, c\'est un bon signe.';
    } else if (growthRate > -10) {
      return '💪 Une légère baisse, mais rien d\'inquiétant. Vous allez rebondir !';
    } else {
      return '🤔 Analysez les causes de cette baisse pour mieux rebondir.';
    }
  }

  getRevenueStatus(): string {
    if (!this.revenueData) return '';

    const currentRevenue = this.revenueData.totalRevenueLast30Days;
    const predictedRevenue = this.revenueData.predictedRevenueNext30Days;

    if (predictedRevenue > currentRevenue * 1.2) {
      return 'excellent';
    } else if (predictedRevenue > currentRevenue) {
      return 'bon';
    } else if (predictedRevenue === currentRevenue) {
      return 'stable';
    } else {
      return 'attention';
    }
  }
}


