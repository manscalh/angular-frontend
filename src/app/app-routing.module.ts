import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './views/login/login.component';
import { PrinterComponent } from './views/dashboard/printer.component';
import { HomeComponent } from './views/home/home.component';
import { UserComponent } from './views/management/user/user.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { MenuComponent } from './views/management/menu/menu.component';
import { GroupAccessComponent } from './views/management/group-access/group-access.component';
import { NewGroupAccessComponent } from './views/management/group-access/details/details.component';
import { NewUserComponent } from './views/management/user/details/details.component';
import { NewMenuComponent } from './views/management/menu/details/details.component';
import { UnauthorizedComponent } from './views/unauthorized/unauthorized.component';
import { CompanyComponent } from './views/management/company/company.component';
import { ProductComponent } from './views/management/product/product.component';
import { NewCompanyComponent } from './views/management/company/details/details.component';
import { NewProductComponent } from './views/management/product/details/details.component';
import { CircularityComponent } from './views/circularity/circularity.component';
import { StartCircularityComponent } from './views/circularity/start/start.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "dashboard",
    component: PrinterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "home",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/group-access",
    component: GroupAccessComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/group-access/details",
    component: NewGroupAccessComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/group-access/details/:id",
    component: NewGroupAccessComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/user",
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/user/details",
    component: NewUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/user/details/:id",
    component: NewUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/user",
    component: UserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/user/create",
    component: NewUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/user/edit/:id",
    component: NewUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/menu",
    component: MenuComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/menu/details",
    component: NewMenuComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/menu/details/:id",
    component: NewMenuComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/menu/details/:id/:idDad",
    component: NewMenuComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/company",
    component: CompanyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/company/details",
    component: NewCompanyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/company/details/:id",
    component: NewCompanyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/products",
    component: ProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/products/details",
    component: NewProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "management/products/details/:id",
    component: NewProductComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "circularity/list",
    component: CircularityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "circularity/start",
    component: StartCircularityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "circularity/start/:id",
    component: StartCircularityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "unauthorized",
    component: UnauthorizedComponent,
    canActivate: [AuthGuard],
  },
  {path: '404', component: NotfoundComponent, canActivate: [AuthGuard],},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
