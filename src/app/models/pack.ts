export interface Pack {
    id: number;
    nom: string;
    description: string;
    prixMensuel: number;
    prixAnnuel: number;
    duree: number;
    type: string; // 'SILVER' | 'GOLD' | 'PLATINUM'
    avantages: string[];
}