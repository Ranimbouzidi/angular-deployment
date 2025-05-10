import { Component, OnInit } from '@angular/core';
import { UserSubscriptionService } from '../../services/user-subscription.service';
import { SubscriptionNotificationService } from '../../services/subscription-notification.service';
import { Paiement } from '../../models/payment.model';
import { MessagesModalService } from '../../messages-modal.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-subscriptions',
  templateUrl: './user-subscriptions.component.html',
  styleUrls: ['./user-subscriptions.component.scss']
})
export class UserSubscriptionsComponent implements OnInit {
  subscriptions: Paiement[] = [];
  activeSubscription: Paiement | null = null;
  currentUser: User | null = null;
  isLoading = true;
  subscriptionStatus: { status: string, daysRemaining: number } | null = null;

  constructor(
    private subscriptionService: UserSubscriptionService,
    private notificationService: SubscriptionNotificationService,
    private messagesModalService: MessagesModalService
  ) { }

  ngOnInit(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      this.loadUserSubscriptions();
      this.checkExpiringSubscriptions();
    }
  }

  async checkExpiringSubscriptions(): Promise<void> {
    try {
      await this.notificationService.checkExpiringSubscriptions();
    } catch (error) {
      console.error('Error checking expiring subscriptions:', error);
    }
  }

  async sendRenewalConfirmation(): Promise<void> {
    if (!this.activeSubscription?.id) return;

    try {
      await this.notificationService.sendRenewalConfirmation(this.activeSubscription.id);
      this.messagesModalService.toastSuccess('Confirmation de renouvellement envoyée avec succès');
    } catch (error) {
      this.messagesModalService.toastError('Erreur lors de l\'envoi de la confirmation');
      console.error('Error sending renewal confirmation:', error);
    }
  }

  loadUserSubscriptions(): void {
    if (!this.currentUser) return;

    this.isLoading = true;
    this.subscriptionService.getUserSubscriptions(this.currentUser.id).subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.loadActiveSubscription();
      },
      error: (error) => {
        this.messagesModalService.toastError('Erreur lors du chargement des abonnements');
        console.error('Error loading subscriptions:', error);
        this.isLoading = false;
      }
    });
  }

  loadActiveSubscription(): void {
    if (!this.currentUser) return;

    this.subscriptionService.getActiveSubscription(this.currentUser.id).subscribe({
      next: (subscription) => {
        this.activeSubscription = subscription;
        if (subscription) {
          this.subscriptionStatus = this.subscriptionService.calculateSubscriptionStatus(subscription);
          if (this.subscriptionStatus.status === 'Expiration proche') {
            this.sendRenewalConfirmation();
          }
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading active subscription:', error);
        this.isLoading = false;
      }
    });
  }

  getSubscriptionStatus(payment: Paiement): string {
    const status = this.subscriptionService.calculateSubscriptionStatus(payment);
    return status.status;
  }

  getSubscriptionProgress(payment: Paiement): number {
    const startDate = new Date(payment.datePaiement);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + payment.packAbonnement.duree);
    
    const totalDays = payment.packAbonnement.duree;
    const elapsedDays = Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  }

  getRemainingDays(payment: Paiement): number {
    const status = this.subscriptionService.calculateSubscriptionStatus(payment);
    return status.daysRemaining;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Actif':
        return 'bg-success';
      case 'Expiration proche':
        return 'bg-warning';
      case 'Expiré':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
} 