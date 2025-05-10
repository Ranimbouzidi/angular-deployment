export enum Role {
  ADMIN = 'ADMIN',
  RH = 'RH',
  CLIENT = 'CLIENT',
  FORMATEUR = 'FORMATEUR',
  EMPLOYEE = 'EMPLOYEE'
}


export class User {
  id: number = 0;
  nom: string = '';
  prenom: string = '';
  email: string = '';
  numeroDeTelephone: string = '';
  role: string = '';
  adresseLivraison?: string;
  motDePasse?: string;
  photo?: string;
  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }}

