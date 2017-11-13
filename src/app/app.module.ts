import { AccountInactiveGuard } from './common/guards/account-inactive.guard'
import { UiFeedbackService } from './common/services/ui-feedback.service'
import { UnhashModule } from './common/pipes/unhash/unhash.module'
import { DefaultInterceptor } from './common/interceptors/default.interceptor'
import { ThemeService } from './common/services/theme.service'
import { MarkdownEditorModule } from './components/markdown-editor/markdown-editor.module'
import { PrintModule } from './containers/print/print.module'
import { NgModule, LOCALE_ID } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { HttpModule } from '@angular/http'
import { HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

// db
import { FIREBASE_CONFIG } from './common/config/firebase.config'
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { AngularFireOfflineModule } from 'angularfire2-offline'
import { DataService } from './common/services/data.service'

// google map
import { AgmCoreModule } from '@agm/core'
import { GOOGLE_MAP_API_KEY } from './common/config/google-map.config'
import { GeocoderService } from './common/services/geocoder.service'

// ui
import { FlexLayoutModule } from '@angular/flex-layout'
import { MediaQueryService } from './common/services/media-query.service'
import 'hammerjs'

import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatCardModule } from '@angular/material/card'


import { SidenavListModule } from './components/sidenav-list/sidenav-list.module'


// guards
import { AuthGuard } from './common/guards/auth.guard'
import { VisitorGuard } from './common/guards/visitor.guard'
import { AccountActiveGuard } from './common/guards/account-active.guard'
import { AdminGuard } from './common/guards/admin.guard'

// containers

import { AnimalModule } from './containers/animal/animal.module'
import { ConsultationModule } from './containers/consultation/consultation.module'
import { CustomerModule } from './containers/customer/customer.module'

import { SettingsModule } from './containers/settings/settings.module'
import { ProfileModule } from './containers/profile/profile.module'
import { AgendaModule } from './containers/agenda/agenda.module'
// ---
import { SignInModule } from './containers/sign-in/sign-in.module'
import { SignUpModule } from './containers/sign-up/sign-up.module'
import { SignOutModule } from './containers/sign-out/sign-out.module'

import { HomeComponent } from './containers/home/home.component'
import { ShellComponent } from './shell/shell.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShellComponent,
  ],
  imports: [
    // core
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,

    AppRoutingModule,
    PrintModule,
    MarkdownEditorModule,

    // db
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    AngularFireOfflineModule,
    AngularFireAuthModule,
    // maps
    AgmCoreModule.forRoot({ apiKey: GOOGLE_MAP_API_KEY }),

    // layout
    FlexLayoutModule,

    // material
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,

    // components
    SidenavListModule,
    UnhashModule,

    // containers
    AnimalModule,
    ConsultationModule,
    CustomerModule,

    ProfileModule,
    SettingsModule,

    AgendaModule,

    SignInModule,
    SignOutModule,
    SignUpModule,
  ],
  providers: [
    // services
    DataService,
    MediaQueryService,
    GeocoderService,
    ThemeService,
    UiFeedbackService,
    // guards
    AccountActiveGuard,
    AccountInactiveGuard,
    AdminGuard,
    AuthGuard,
    VisitorGuard,
    // intl
    {
      provide: LOCALE_ID,
      useValue: 'fr-FR'
    },
    // interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
