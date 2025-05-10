import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './admin/layout/base/base.component';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorPageComponent } from './admin/pages/error-page/error-page.component';
import { AdminSettingsComponent } from './admin/pages/admin-settings/admin-settings.component';
import { AllUsersComponent } from './admin/pages/all-users/all-users.component';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';
import { UserProfileSettingsComponent } from './user-profile-settings/user-profile-settings.component';
import { UserProfilePageComponent } from './user-profile-page/user-profile-page.component';
import { AbonnementComponent } from './admin/pages/abonnement/abonnement.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './front-office/layout/layout.component';
import { StatsComponent } from './admin/pages/stats/stats.component';
import { UserRevenueComponent } from './user-revenue/user-revenue.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import{ ChatComponent } from './admin/pages/chat/chat.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


export const routes: Routes = [
  {
    path: 'achref',
    component: HomeComponent
  },
  {
    path:'',
    loadChildren: () =>
      import('./front-office/front-office.module').then(
        (m) => m.FrontOfficeModule
      ),
  },
  {
    path: 'connexion',
    component: UserLoginComponent
  },
  {
    path: 'inscription',
    component: UserRegisterComponent
  },
  {
    path: 'verify-code',
    component: VerifyCodeComponent
  },
  {
    path: 'mot-de-passe-oublie',
    component: ForgetPasswordComponent
  },


  {
    path: 'mon-compte',
    component: UsersDashboardComponent,
    children: [
      {
        path: '',
        component: UserProfileSettingsComponent
      },








    ]
  },
  {
    path: 'profil/:id',
    component: UserProfilePageComponent
  },


  {
    path: 'compte',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [

      


      {
        path: 'admin/abonnements',
        component: AbonnementComponent
      },

      { path: 'admin/abonnements/stats', 
        component: StatsComponent },


      {
        path: 'admin/dashboard',
        component: DashboardComponent
      },

      {
        path: 'admin/utilisateurs',
        component: AllUsersComponent
      },
      
      {
        path: 'user-revenue',
        component: UserRevenueComponent
      },
      {
        path: 'admin/parametres',
        component: AdminSettingsComponent
      },
      {path:'admin/ai-dashboard',
        component:AdminDashboardComponent
      },





      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      // { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'error',
    component: ErrorPageComponent,
    data: {
      'type': 404,
      'title': 'Page Not Found',
      'desc': 'Oopps!! The page you were looking for doesn\'t exist.'
    }
  },
  {
    path: 'error/:type',
    component: ErrorPageComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },

  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
