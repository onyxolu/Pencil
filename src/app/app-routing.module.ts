import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PencilComponent } from './pages/private/pencil/pencil.component';
import { LoginComponent } from './pages/public/login/login.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'app',
    component: PencilComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
