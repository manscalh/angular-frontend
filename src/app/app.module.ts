import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarComponent } from './components/template/sidebar/sidebar.component';
import { ContentComponent } from './components/template/content/content.component';
import { HeaderComponent } from './components/template/header/header.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import * as more from 'highcharts/highcharts-more.src';
import * as exporting from 'highcharts/modules/exporting.src';
import * as solidGauge from 'highcharts/modules/solid-gauge.src';
import * as drilldown from 'highcharts/modules/drilldown.src'; 
import { ColumnComponent } from './components/charts/column/column.component';
import { LineComponent } from './components/charts/line/line.component';
import { SolidgaugeComponent } from './components/charts/solidgauge/solidgauge.component';
import { LoginComponent } from './views/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './core/guards/auth.guard';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SettingsComponent } from './views/settings/settings.component';
import { ProfileComponent } from './views/profile/profile.component';
import { PieComponent } from './components/charts/pie/pie.component';
import { DataTablesModule } from 'angular-datatables';
import { BoxorlabelTableComponent } from './views/dashboard/tables/boxorlabel-table/boxorlabel-table.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PrinterComponent } from './views/dashboard/printer.component';
import { UserComponent } from './views/management/user/user.component';
import { FullPackagingComponent } from './views/dashboard/printer-charts/full-packaging/full-packaging.component';
import { LifetimeComponent } from './views/dashboard/printer-charts/lifetime/lifetime.component';
import { CycleTimeComponent } from './views/dashboard/printer-charts/cycle-time/cycle-time.component';
import { FullCycleComponent } from './views/dashboard/printer-charts/full-cycle/full-cycle.component';
import { CarbonReductionComponent } from './views/dashboard/printer-charts/carbon-reduction/carbon-reduction.component';
import { FinancialEconomyComponent } from './views/dashboard/printer-charts/financial-economy/financial-economy.component';
import { MaximumCycleComponent } from './views/dashboard/printer-charts/maximum-cycle/maximum-cycle.component';
import { ValueOfAllPackagingComponent } from './views/dashboard/printer-charts/value-of-all-packaging/value-of-all-packaging.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { GroupAccessComponent } from './views/management/group-access/group-access.component';
import { NewGroupAccessComponent } from './views/management/group-access/details/details.component';
import { NewUserComponent } from './views/management/user/details/details.component';
import { TemplateModule } from './components/template/template.module';
import { CompleteCyclesPerItemComponent } from './views/dashboard/printer-charts/complete-cycles-per-item/complete-cycles-per-item.component';
import { RecycledPackagingComponent } from './views/dashboard/printer-charts/recycled-packaging/recycled-packaging.component';
import { LostPackagingComponent } from './views/dashboard/printer-charts/lost-packaging/lost-packaging.component';
import { QuantityTypePackagingComponent } from './views/dashboard/printer-charts/quantity-type-packaging/quantity-type-packaging.component';
import { ScanHistoryTableComponent } from './views/dashboard/tables/scan-history-table/scan-history-table.component';
import { PackagingLocationComponent } from './views/dashboard/maps/packaging-location/packaging-location.component';
import { HomeComponent } from './views/home/home.component';
import { MenuComponent } from './views/management/menu/menu.component';
import { NewMenuComponent } from './views/management/menu/details/details.component';
import { CompanyComponent } from './views/management/company/company.component';
import { NewCompanyComponent } from './views/management/company/details/details.component';
import { ProductComponent } from './views/management/product/product.component';
import { NewProductComponent } from './views/management/product/details/details.component';
import { ChangePasswordComponent } from './views/login/change-password/change-password.component';
import { SkeletonTableComponent } from './components/skeleton/skeleton-table/skeleton-table.component';
import { SkeletonFormComponent } from './components/skeleton/skeleton-form/skeleton-form.component';
import { LoadingComponent } from './components/template/loading/loading.component';
import { CircularityComponent } from './views/circularity/circularity.component';
import { StartCircularityComponent } from './views/circularity/start/start.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ContentComponent,
    HeaderComponent,
    ColumnComponent,
    LineComponent,
    SolidgaugeComponent,
    PrinterComponent,
    LoginComponent,
    SettingsComponent,
    ProfileComponent,
    PieComponent,
    BoxorlabelTableComponent,
    UserComponent,   
    NewGroupAccessComponent,
    NewUserComponent,
    GroupAccessComponent,    
    FullPackagingComponent,
    LifetimeComponent,
    CycleTimeComponent,
    FullCycleComponent,
    CarbonReductionComponent,
    FinancialEconomyComponent,
    LostPackagingComponent,
    MaximumCycleComponent,
    ValueOfAllPackagingComponent,
    CompleteCyclesPerItemComponent,
    RecycledPackagingComponent,
    QuantityTypePackagingComponent,
    ScanHistoryTableComponent,
    PackagingLocationComponent,
    HomeComponent,
    MenuComponent,
    NewMenuComponent,
    CompanyComponent,
    ProductComponent,
    NewProductComponent,
    NewCompanyComponent,
    ChangePasswordComponent,
    SkeletonTableComponent,
    SkeletonFormComponent,
    LoadingComponent,
    CircularityComponent,
    StartCircularityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonModule,
    NgxSkeletonLoaderModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ChartModule,
    ModalModule.forRoot(),
    DataTablesModule,
    NgxPaginationModule,
    TemplateModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: () => [ more, exporting, solidGauge, drilldown ] } // add as factory to your providers
    , AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
