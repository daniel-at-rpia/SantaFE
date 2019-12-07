import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { CoreModule } from 'Core/core.module';
import { reducer } from 'Trade/reducers/trade.reducer';
import { TradeEffect } from 'Trade/effects/trade.effects';
import { TradePage } from 'Trade/trade.page';
import { TradeCenterPanel } from 'Trade/containers/trade-center-panel.container';
import { TradeAlertPanel } from 'Trade/containers/trade-alert-panel.container';
import { TradeUtilityPanel } from 'Trade/containers/trade-utility-panel.container';
import { TradeLiveGraphPanel } from 'Trade/containers/trade-live-graph-panel.container';
import { TradeOverviewGraphPanel } from 'Trade/containers/trade-overview-graph-panel.container';
import { LiveDataProcessingService } from 'Trade/services/LiveDataProcessingService';

@NgModule({
  declarations: [
    TradePage,
    TradeCenterPanel,
    TradeAlertPanel,
    TradeUtilityPanel,
    TradeLiveGraphPanel,
    TradeOverviewGraphPanel
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'trade', component: TradePage
      }
    ]),
    StoreModule.forFeature('trade', reducer),
    EffectsModule.forFeature([TradeEffect]),

    CoreModule
  ],
  providers: [
    LiveDataProcessingService
  ]
})
export class TradeModule { }
