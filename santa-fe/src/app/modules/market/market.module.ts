import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MarketPage } from './market.page';
import { MarketContainer } from './containers/market.container';
import { SecurityCard } from './components/security-card/security-card.component';

import { DTOService } from '../../services/DTOService';

@NgModule({
  declarations: [
    MarketPage,
    MarketContainer,
    SecurityCard
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'market', component: MarketPage
      }
    ])
  ],
  providers: [
  ]
})
export class MarketModule { }
