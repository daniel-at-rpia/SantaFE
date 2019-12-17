import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AgGridModule } from 'ag-grid-angular';

import { SecurityCard } from 'Core/components/security-card/security-card.component';
import { CoreModule } from 'Core/core.module';
import { reducer } from 'Trade/reducers/trade.reducer';
import { TradeEffect } from 'Trade/effects/trade.effects';
import { TradePage } from 'Trade/trade.page';
import { TradeCenterPanel } from 'Trade/containers/trade-center-panel.container';
import { TradeAlertPanel } from 'Trade/containers/trade-alert-panel.container';
import { TradeUtilityPanel } from 'Trade/containers/trade-utility-panel.container';
import { TradeMarketAnalysisPanel } from 'Trade/containers/trade-market-analysis-panel.container';
import { TradeObligorGraphPanel } from 'Trade/containers/trade-obligor-graph-panel.container';
import { LiveDataProcessingService } from 'Trade/services/LiveDataProcessingService';
import { QuantitativeVisualizer } from 'Trade/components/quantitative-visualizer/quantitative-visualizer.component';
import { TradeMarketAnalysisTable } from 'Trade/components/market-analysis-table/market-analysis-table.component';

@NgModule({
  declarations: [
    TradePage,
    TradeCenterPanel,
    TradeAlertPanel,
    TradeUtilityPanel,
    TradeMarketAnalysisPanel,
    TradeObligorGraphPanel,
    QuantitativeVisualizer,
    TradeMarketAnalysisTable
  ],
  imports: [
    // Angular framework modules
    CommonModule,
    RouterModule.forChild([
      {
        path: 'trade', component: TradePage
      }
    ]),
    StoreModule.forFeature('trade', reducer),
    EffectsModule.forFeature([TradeEffect]),

    // 3rd party dependencies
    AgGridModule.withComponents([SecurityCard]),

    // Native modules
    CoreModule
  ],
  providers: [
    LiveDataProcessingService
  ]
})
export class TradeModule { }
