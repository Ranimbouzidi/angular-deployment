import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PacksService } from '../../../services/packs.service';
import { MessagesModalService } from '../../../messages-modal.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Statistiques des abonnements par type de pack',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} utilisateurs`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mois'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Nombre d\'utilisateurs'
        },
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  isLoading = true;
  errorMessage = '';

  constructor(
    private packsService: PacksService,
    private messagesService: MessagesModalService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.packsService.getMonthlyStats().subscribe({
      next: (response) => {
        console.log('Données reçues:', response);
        
        if (!response || Object.keys(response).length === 0) {
          this.errorMessage = 'Aucune donnée disponible';
          this.messagesService.toastError('Aucune donnée disponible');
          return;
        }

        const months = Object.keys(response).sort();
        const packTypes = new Set<string>();
        
        // Récupérer tous les types de packs
        months.forEach(month => {
          Object.keys(response[month]).forEach(type => {
            packTypes.add(type);
          });
        });

        // Convertir les mois au format "MMM YYYY"
        this.barChartLabels = months.map(month => {
          const [year, monthNum] = month.split('-');
          return new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('fr-FR', {
            month: 'short',
            year: 'numeric'
          });
        });

        // Créer les datasets pour chaque type de pack
        this.barChartData = {
          labels: this.barChartLabels,
          datasets: Array.from(packTypes).map(type => ({
            label: type,
            data: months.map(month => response[month][type] || 0),
            backgroundColor: this.getColorForType(type),
            borderColor: this.getBorderColorForType(type),
            borderWidth: 1
          }))
        };

        this.chart?.update();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.errorMessage = 'Erreur lors du chargement des statistiques';
        this.messagesService.toastError('Erreur lors du chargement des statistiques');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private getColorForType(type: string): string {
    switch(type.toUpperCase()) {
      case 'SILVER':
        return 'rgba(192, 192, 192, 0.5)';
      case 'GOLD':
        return 'rgba(255, 215, 0, 0.5)';
      case 'PLATINUM':
        return 'rgba(229, 228, 226, 0.5)';
      default:
        return 'rgba(0, 0, 0, 0.1)';
    }
  }

  private getBorderColorForType(type: string): string {
    switch(type.toUpperCase()) {
      case 'SILVER':
        return 'rgba(192, 192, 192, 1)';
      case 'GOLD':
        return 'rgba(255, 215, 0, 1)';
      case 'PLATINUM':
        return 'rgba(229, 228, 226, 1)';
      default:
        return 'rgba(0, 0, 0, 1)';
    }
  }
}
