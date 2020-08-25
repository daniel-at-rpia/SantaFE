import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';
import { TradeModule } from 'Trade/trade.module';
import { StructurePage } from 'Structure/structure.page';
import { NavigationModule } from 'Core/constants/coreConstants.constant';

import { StructureMainPanel } from 'Structure/containers/structure-main-panel.container';
import { StructureFund } from 'App/modules/structure/containers/structure-fund.container';
import { TargetBar } from 'App/modules/structure/components/target-bar.component'
import { PortfolioBreakdown } from 'App/modules/structure/containers/portfolio-breakdown/portfolio-breakdown.container';

@NgModule({
  declarations: [
    StructurePage,
    StructureMainPanel,
    StructureFund, 
    TargetBar,
    PortfolioBreakdown
  ],
  imports: [
    // Angular framework modules
    CommonModule,
    RouterModule.forChild([
      {
        path: NavigationModule.structuring, component: StructurePage
      }
    ]),

    // Native modules
    CoreModule,
    TradeModule
  ]
})
export class StructureModule { }
