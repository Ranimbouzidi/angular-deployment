import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { AllTemplateFrontComponent } from './all-template-front/all-template-front.component';
import { FooterFrontComponent } from './footer-front/footer-front.component';
import { HeaderFrontComponent } from './header-front/header-front.component';
import { LawFirmComponent } from './law-firm/law-firm.component';
import { AboutComponent } from './about/about.component';
import { FormateurComponent } from './formateur/formateur.component';
import { LawyerComponent } from './lawyer/lawyer.component';
import { CasesComponent } from './cases/cases.component';
import { PricingComponent } from './pricing/pricing.component';
import { ServicesComponent } from './services/services.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { ContactComponent } from './contact/contact.component';
import { LayoutComponent } from './layout/layout.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import{ NgChartsModule } from 'ng2-charts';
import { UserSubscriptionsComponent } from './user-subscriptions/user-subscriptions.component';


@NgModule({
  declarations: [
    AllTemplateFrontComponent,
    FooterFrontComponent,
    HeaderFrontComponent,
    LawFirmComponent,
    AboutComponent,
    FormateurComponent,
    LawyerComponent,
    CasesComponent,
    PricingComponent,
    ServicesComponent,
    ServiceDetailComponent,
    BlogsComponent,
    BlogDetailComponent,
    ContactComponent,
    LayoutComponent,
    UserSubscriptionsComponent
  ],
  imports: [
    CommonModule,
    FrontOfficeRoutingModule,
    NgbCollapseModule,
    NgChartsModule,
   
    RouterModule.forChild([
      // Routes front-office
    ])
  ]
})
export class FrontOfficeModule { }
