import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigationModule } from 'Core/constants/coreConstants.constant';

const routes: Routes = [
      {
        path: NavigationModule.market,
        redirectTo: NavigationModule.market,
        pathMatch: 'full'
      },
      {
        path: NavigationModule.trade,
        redirectTo: NavigationModule.trade,
        pathMatch: 'full'
      },
      {
        path: NavigationModule.structuring,
        redirectTo: NavigationModule.structuring,
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
