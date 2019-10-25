import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './modules/home/home.page';
import { WelcomePage } from './modules/welcome/welcome.page';
import { MarketPage } from './modules/market/market.page';


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
