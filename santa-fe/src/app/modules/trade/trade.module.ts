import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FormModule } from 'App/modules/form/form.module';

import { TradePage } from 'Trade/trade.page';

@NgModule({
  declarations: [
    TradePage
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'trade', component: TradePage
      }
    ]),
    FormModule
  ],
  providers: [
  ]
})
export class TradeModule { }
