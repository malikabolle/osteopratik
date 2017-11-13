import { AnimalSearchComponent } from './containers/animal/animal-search/animal-search.component'
import { PrintAllComponent } from './containers/print/print-all/print-all.component'
import { AccountingModule } from './containers/accounting/accounting.module'
import { AccountInactiveGuard } from './common/guards/account-inactive.guard'
import { PrintComponent } from './containers/print/print/print.component'
import { ShellComponent } from './shell/shell.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule, PreloadAllModules } from '@angular/router'

import { AuthGuard } from './common/guards/auth.guard'
import { VisitorGuard } from './common/guards/visitor.guard'
import { AccountActiveGuard } from './common/guards/account-active.guard'
import { AdminGuard } from './common/guards/admin.guard'

import { HomeComponent } from './containers/home/home.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'shell' },
  {
    path: 'shell', component: ShellComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'search/animals', component: AnimalSearchComponent, canActivate: [AccountActiveGuard] },
      { path: 'about', loadChildren: './containers/about/about.module#AboutModule' },
      { path: 'sign-in', loadChildren: './containers/sign-in/sign-in.module#SignInModule', canActivate: [VisitorGuard] },
      { path: 'sign-up', loadChildren: './containers/sign-up/sign-up.module#SignUpModule', canActivate: [VisitorGuard] },
      { path: 'sign-out', loadChildren: './containers/sign-out/sign-out.module#SignOutModule', canActivate: [AuthGuard] },
      { path: 'register', loadChildren: './containers/register/register.module#RegisterModule', canActivate: [AccountInactiveGuard] },
      { path: 'profile', loadChildren: './containers/profile/profile.module#ProfileModule', canActivate: [AuthGuard], },
      { path: 'settings', loadChildren: './containers/settings/settings.module#SettingsModule' },
      { path: 'agenda', loadChildren: './containers/agenda/agenda.module#AgendaModule', canActivate: [AccountActiveGuard] },
      { path: 'statistics-lazy', loadChildren: './containers/statistics/statistics.module#StatisticsModule', canActivate: [AccountActiveGuard] },
      { path: 'customer-lazy', loadChildren: './containers/customer/customer.module#CustomerModule', canActivate: [AccountActiveGuard] },
      { path: 'invoice-lazy', loadChildren: './containers/invoice/invoice.module#InvoiceModule', canActivate: [AccountActiveGuard] },
      { path: 'accounting-lazy', loadChildren: './containers/accounting/accounting.module#AccountingModule', canActivate: [AccountActiveGuard] },
      { path: 'admin-lazy', loadChildren: './containers/admin/admin.module#AdminModule', canActivate: [AdminGuard] },
      { path: '**', redirectTo: '' },
    ]
  },
  { path: 'print/:customerKey/:animalKey/:consultationKey', component: PrintComponent },
  { path: 'print-all/:year', component: PrintAllComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
