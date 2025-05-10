import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Acceuil',
    isTitle: true,
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/compte/admin/dashboard',
  },
  {
    label: 'Pages',
    isTitle: true,
  },

  {
    label: `abonnements`,
    icon: 'list',
    subItems: [
     
      {
        label: 'Toutes les abonnements',
        link: 'admin/abonnements',
      },
      { 
        label: 'Statistiques',
        link: 'admin/abonnements/stats',
      }
    ],
  },
  {
    label: 'utilisateurs',
    icon: 'users',
    subItems: [ 
      {
        label: 'Tous les utilisateurs',
        link: 'admin/utilisateurs',
      },
    ],
  },


  { label:'analyses',
    icon:'file-text',
    link:'/compte/admin/ai-dashboard',
    },


  {
    label: 'Paramétres',
    isTitle: true,
  },

  {
    label: 'Mon compte',
    icon: 'settings',
    link: '/compte/admin/parametres',
  },
];
