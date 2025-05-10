import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Pack } from 'src/app/models/pack';
import { User } from 'src/app/models/user';
import { PacksService } from 'src/app/services/packs.service';
import { UserService } from 'src/app/services/UserService';
import { PaiementService } from 'src/app/services/paiement.service';
import { RecuService } from 'src/app/services/recu.service';
import { Router } from '@angular/router';
import { MessagesModalService } from 'src/app/messages-modal.service';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit, OnDestroy {
  @ViewChild('cardElement') cardElement: ElementRef;
  
  abonnements: Pack[] = [];
  filteredAbonnements: Pack[] = [];
  currentUser: User | null = null;
  selectedPack: Pack | null = null;
  showPaymentModal = false;
  isYearlyPricing: boolean = false;
  
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private card: StripeCardElement | null = null;
  private cardErrors: HTMLElement | null = null;
  
  constructor(
    public packService: PacksService, 
    private userService: UserService, 
    private paiementService: PaiementService,
    private recuService: RecuService,
    private router: Router,
    private messagesModalService: MessagesModalService
  ) {
    // Initialiser Stripe
    this.initializeStripe();
  }

  private async initializeStripe() {
    this.stripe = await this.paiementService.getStripeInstance();
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
      
      this.card.on('change', (event) => {
        this.cardErrors = document.getElementById('card-errors');
        if (this.cardErrors) {
          if (event.error) {
            this.cardErrors.textContent = event.error.message;
          } else {
            this.cardErrors.textContent = '';
          }
        }
      });
    }
  }

  async ngOnInit() {
    // Récupérer l'utilisateur connecté
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
    }
    this.loadAllPack();
  }

  loadAllPack() {
    this.packService.getAllPacks().subscribe(
      (abonnements: Pack[]) => {
        this.abonnements = abonnements.reverse();
        this.filteredAbonnements = abonnements;
      },
      (error) => {
        this.messagesModalService.toastError('Erreur lors du chargement des abonnements');
        console.error('Error fetching abonnements:', error);
      }
    );
  }

  togglePricing() {
    this.isYearlyPricing = !this.isYearlyPricing;
  }

  getCurrentPrice(pack: Pack): string {
    const prix = pack.prixMensuel;
    if (isNaN(prix)) {
      return '0.00';
    }
    if (this.isYearlyPricing) {
      const yearlyPrice = prix * 12;
      const discountedPrice = yearlyPrice * 0.8;
      return discountedPrice.toFixed(2);
    }
    return prix.toFixed(2);
  }

  getPricePeriod(): string {
    return this.isYearlyPricing ? '/an (avec 20% de réduction)' : '/mois';
  }

  // Méthodes ajoutées pour le paiement
  ouvrirModalPaiement(pack: Pack) {
    if (!this.currentUser) {
      this.router.navigate(['/connexion']);
      return;
    }
    this.selectedPack = pack;
    this.showPaymentModal = true;
    
    // Attendre que la modal soit rendue et que Stripe soit initialisé
    setTimeout(() => {
      if (this.stripe) {
        const elements = this.stripe.elements();
        if (this.card) {
          this.card.destroy();
        }
        this.card = elements.create('card');
        this.card.mount('#card-element');
        
        this.card.on('change', (event) => {
          const displayError = document.getElementById('card-errors');
          if (displayError) {
            if (event.error) {
              displayError.textContent = event.error.message;
            } else {
              displayError.textContent = '';
            }
          }
        });
      }
    }, 100);
  }

  fermerModalPaiement() {
    this.showPaymentModal = false;
    if (this.card) {
      this.card.destroy();
      this.card = null;
    }
  }

  async effectuerPaiement() {
    if (!this.selectedPack || !this.currentUser || !this.stripe || !this.card) return;
  
    try {
      // On appelle directement le service avec la carte actuelle
      const paiement = await this.paiementService.effectuerPaiement(
        this.selectedPack,
        this.currentUser,
        this.isYearlyPricing,
        this.card
      );
  
      this.showPaymentModal = false;
      
      // Download the PDF receipt
      if (paiement && paiement.id) {
        const pdfBlob = await this.recuService.downloadRecuPdf(paiement.id);
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recu_${paiement.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      this.messagesModalService.toastSuccess('Paiement effectué avec succès !').then(() => {
        this.router.navigate(['/']);
      });
    } catch (error: any) {
      console.error('Erreur:', error);
      this.messagesModalService.toastError(error.message || 'Erreur lors du paiement. Veuillez réessayer.');
    }
  }
  

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}