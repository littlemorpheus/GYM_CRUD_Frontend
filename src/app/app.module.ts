import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { WorkoutComponent } from './pages/workout/workout.component';
import { UserModalComponent } from './components/user-modal/user-modal.component';
import { AuthInterceptor } from 'services/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    MainNavComponent,
    WorkoutComponent,
    UserModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
