import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';
import { FormModule } from 'App/modules/form/form.module';

import { MarketPage } from 'Market/market.page';
import { MarketGroupPanel } from 'Market/containers/market-group-panel.container';
import { SecurityGroupSimple } from 'Market/components/security-group-simple/security-group-simple.component';
import { SecurityGroupAverageVisualizer } from 'Market/components/security-group-average-visualizer/security-group-average-visualizer.component';

@NgModule({
  declarations: [
    MarketPage,
    MarketGroupPanel,
    SecurityGroupSimple,
    SecurityGroupAverageVisualizer
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'market', component: MarketPage
      }
    ]),
    CoreModule,
    FormModule
  ],
  providers: [
  ]
})
export class MarketModule { }
