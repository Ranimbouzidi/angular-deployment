export interface Paiement {
    id?: number;
    montant: number;
    methode: string;
    datePaiement?: Date;
    packAbonnement: {
        id: number;
    };
    utilisateur: {
        id: number;
    };
}