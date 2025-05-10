import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';

import { LayoutModule } from './admin/layout/layout.module';
import { AuthGuard } from './core/guard/auth.guard';

import { AppComponent } from './app.component';
import { ErrorPageComponent } from './admin/pages/error-page/error-page.component';

import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminSettingsComponent } from './admin/pages/admin-settings/admin-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from './services/UserService';

import { HttpClientModule } from '@angular/common/http';
import { AllUsersComponent } from './admin/pages/all-users/all-users.component';
import { GlobalHeaderComponent } from './global-header/global-header.component';
import { GlobalFooterComponent } from './global-footer/global-footer.component';
import { RouterModule } from '@angular/router';
import { FilterPipe } from './admin/pages/all-users/filter.pipe';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserRegisterComponent } from './user-register/user-register.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';
import { UserProfileSettingsComponent } from './user-profile-settings/user-profile-settings.component';
import { UserProfilePageComponent } from './user-profile-page/user-profile-page.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AbonnementComponent } from './admin/pages/abonnement/abonnement.component';
import { StatsComponent } from './admin/pages/stats/stats.component';
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { UserRevenueComponent } from './user-revenue/user-revenue.component';
import { ChatModule } from './admin/pages/chat/chat.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


@NgModule({
  declarations: [
    AppComponent,
    ErrorPageComponent,
    HomeComponent,
    AdminSettingsComponent,
    AllUsersComponent,
    GlobalHeaderComponent,
    GlobalFooterComponent,
    FilterPipe,
    StatsComponent,
    UserRegisterComponent,
    UsersDashboardComponent,
    UserProfileSettingsComponent,
    UserProfilePageComponent,
    AbonnementComponent,
    UserLoginComponent,
    VerifyCodeComponent,
    ForgetPasswordComponent,
    UserRevenueComponent,
    AdminDashboardComponent,
   
    
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    NgbModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    KeycloakAngularModule,
    NgChartsModule,
    ChatModule,
   
  ],
  providers: [UserService,
    AuthGuard,

    {
      provide: HIGHLIGHT_OPTIONS, // https://www.npmjs.com/package/ngx-highlightjs
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          scss: () => import('highlight.js/lib/languages/scss'),
        }
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly keycloakService: KeycloakService) { }

  // Initialize Keycloak
  async initKeycloak() {
    await this.keycloakService.init({
      config: {
        url: 'http://localhost:8080/',
        realm: 'microservice',
        clientId: 'master',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
    });
  }
}
