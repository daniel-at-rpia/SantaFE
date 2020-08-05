import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
      {
        path: 'market',
        redirectTo: 'market',
        pathMatch: 'full'
      },
      {
        path: 'trade',
        redirectTo: 'trade',
        pathMatch: 'full'
      },
      {
        path: 'structure',
        redirectTo: 'structure',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'trade',
        pathMatch: 'full'
      }
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
