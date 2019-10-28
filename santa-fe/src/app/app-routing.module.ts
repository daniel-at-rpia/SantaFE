import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
      {
        path: 'home',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'market',
        redirectTo: 'market',
        pathMatch: 'full'
      },{
        path: 'trade',
        redirectTo: 'trade',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'market',
        pathMatch: 'full'
      }
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
