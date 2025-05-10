export interface UserInfo {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    numeroDeTelephone?: string;
}

export interface PackAbonnement {
    id: number;
    nom: string;
    description: string;
    prixMensuel: number;
    prixAnnuel: number;
    duree: number;
    type: string;
    avantages: string[];
}

export interface Paiement {
    id?: number;
    montant: number;
    methode: string;
    datePaiement: Date;
    status: string;
    stripePaymentId?: string;
    isYearly: boolean;
    packAbonnement: PackAbonnement;
    utilisateur: UserInfo;
} 