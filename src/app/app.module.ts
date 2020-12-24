import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PencilComponent } from './pages/private/pencil/pencil.component';
import { LoginComponent } from './pages/public/login/login.component';
import { AuthGuard } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [AppComponent, PencilComponent, LoginComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [AuthGuard, AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
