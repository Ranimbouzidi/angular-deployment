import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import{ AllTemplateFrontComponent } from './all-template-front/all-template-front.component';
import { AboutComponent } from './about/about.component';
import { FormateurComponent } from './formateur/formateur.component';
import { LawFirmComponent } from './law-firm/law-firm.component';
import { LawyerComponent } from './lawyer/lawyer.component';
import { CasesComponent } from './cases/cases.component';
import { PricingComponent } from './pricing/pricing.component';
import { ServicesComponent } from './services/services.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { ContactComponent } from './contact/contact.component';
import { LayoutComponent } from './layout/layout.component';
import { UserSubscriptionsComponent } from './user-subscriptions/user-subscriptions.component';
const routes: Routes = [{path:"",   component: LayoutComponent,
  children:[{path:"lawFirm",component:LawFirmComponent},
    {path:"about",component:AboutComponent},
    {path:"Formateur",component:FormateurComponent},
    {path:"Lawyer",component:LawyerComponent},
    {path:"case",component:CasesComponent},
    {path:"pricing",component:PricingComponent},
    {path:"services",component:ServicesComponent},
    {path:"serviceDetail",component:ServiceDetailComponent},
    {path:"blogs",component:BlogsComponent },
    {path:"blogdetail",component:BlogDetailComponent},
    {path:"contact",component:ContactComponent},
    {path:"mes-abonnements",component:UserSubscriptionsComponent}]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
