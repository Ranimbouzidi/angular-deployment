import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { BaseService } from '../base.service';
import { Pack } from '../models/pack';
import { User } from '../models/user';
import { Paiement, PackAbonnement, UserInfo } from '../models/payment.model';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class PaiementService extends BaseService {
  private apiUrl = environment.apiUrl;
  private stripePromise = loadStripe(environment.stripe.publicKey);

  constructor(private http: HttpClient) { 
    super();
  }

  async getStripeInstance(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  async effectuerPaiement(pack: Pack, user: User, isYearly: boolean = false, cardElement: StripeCardElement): Promise<Paiement> {
    const packAbonnement: PackAbonnement = {
      id: pack.id,
      nom: pack.nom,
      description: pack.description,
      prixMensuel: pack.prixMensuel,
      prixAnnuel: pack.prixAnnuel,
      duree: pack.duree,
      type: pack.type,
      avantages: pack.avantages
    };

    const userInfo: UserInfo = {
      id: user.id,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      numeroDeTelephone: user.numeroDeTelephone
    };

    const paiement: Paiement = {
      montant: Number(isYearly ? pack.prixAnnuel : pack.prixMensuel),
      methode: 'Carte',
      packAbonnement: packAbonnement,
      utilisateur: userInfo,
      datePaiement: new Date(),
      isYearly: isYearly,
      status: 'PENDING'
    };

    try {
      // Create Stripe payment session with query parameters
      const response = await firstValueFrom(
        this.http.post<{ clientSecret: string }>(
          `${this.apiUrl}/create-intent?packId=${pack.id}&userId=${user.id}&isYearly=${isYearly}`,
          {
            amount: paiement.montant * 100,
            currency: 'eur'
          },
          {
            headers: this.getAuthHeaders(),
            withCredentials: true
          }
        )
      );

      if (!response) {
        throw new Error('La réponse du serveur est vide');
      }

      const stripe = await this.stripePromise;
      if (!stripe) {
        throw new Error('Stripe n\'a pas pu être initialisé');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(response.clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${user.prenom} ${user.nom}`,
            email: user.email
          }
        }
      });

      if (error) {
        throw error;
      }

      // Update payment status and add Stripe payment ID
      paiement.status = 'COMPLETED';
      paiement.stripePaymentId = paymentIntent?.id;

      // Save the payment in our database and return the saved payment
      const savedPaiement = await firstValueFrom(
        this.http.post<Paiement>(
          `${this.apiUrl}/paiements`,
          paiement,
          {
            headers: this.getAuthHeaders(),
            withCredentials: true
          }
        )
      );

      return savedPaiement;
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      throw error;
    }
  }

  getHistoriquePaiements(userId: number): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(`${this.apiUrl}/historique/${userId}`);
  }
}
