import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CoreModule } from 'Core/core.module';
import { FormModule } from 'App/modules/form/form.module';
import { reducer } from 'Trade/reducers/trade.reducer';
import { TradeEffect } from 'Trade/effects/trade.effects';
import { TradePage } from 'Trade/trade.page';
import { TradeCenterPanel } from 'Trade/containers/trade-center-panel.container';
import { TradeAlertPanel } from 'Trade/containers/trade-alert-panel.container';
import { TradeUtilityPanel } from 'Trade/containers/trade-utility-panel.container';
import { TradeMarketAnalysisPanel } from 'Trade/containers/trade-market-analysis-panel.container';
import { TradeObligorGraphPanel } from 'Trade/containers/trade-obligor-graph-panel.container';
import { LiveDataProcessingService } from 'Trade/services/LiveDataProcessingService';
import { ObligorGraph } from './components/obligor-graph/obligor-graph';
import { HistoricalSummary } from 'Trade/containers/historical-summary.container';
import {AlertCountSummary} from "Trade/components/alert-count-summary/alert-count-summary";
import { AlertWatchList } from "Trade/components/alert-watch-list/alert-watch-list.component";
import { NavigationModule } from "Core/constants/coreConstants.constant";

@NgModule({
  declarations: [
    AlertCountSummary,
    TradePage,
    TradeCenterPanel,
    TradeAlertPanel,
    TradeUtilityPanel,
    TradeMarketAnalysisPanel,
    TradeObligorGraphPanel,
    ObligorGraph,
    HistoricalSummary,
    AlertWatchList
  ],
  imports: [
    // Angular framework modules
    CommonModule,
    RouterModule.forChild([
      {
        path: NavigationModule.trade, component: TradePage
      }
    ]),
    StoreModule.forFeature(NavigationModule.trade, reducer),
    EffectsModule.forFeature([TradeEffect]),

    // angular material
    MatFormFieldModule,
    MatInputModule,

    // Native modules
    CoreModule,
    FormModule
  ],
  providers: [
    LiveDataProcessingService
  ],
  exports: []
})
export class TradeModule { }
