import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';

import { TradePage } from 'Trade/trade.page';
import { TradeCenterPanel } from 'Trade/containers/trade-center-panel.container';
import { TradeAlertPanel } from 'Trade/containers/trade-alert-panel.container';
import { TradeUtilityPanel } from 'Trade/containers/trade-utility-panel.container';
import { TradeLiveGraphPanel } from 'Trade/containers/trade-live-graph-panel.container';
import { TradeOverviewGraphPanel } from 'Trade/containers/trade-overview-graph-panel.container';
import { QuantitativeComparer } from 'Trade/components/quantitative-comparer/quantitative-comparer.component';

@NgModule({
  declarations: [
    TradePage,
    TradeCenterPanel,
    TradeAlertPanel,
    TradeUtilityPanel,
    TradeLiveGraphPanel,
    TradeOverviewGraphPanel,
    QuantitativeComparer
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'trade', component: TradePage
      }
    ]),
    CoreModule
  ],
  providers: [
  ]
})
export class TradeModule { }
