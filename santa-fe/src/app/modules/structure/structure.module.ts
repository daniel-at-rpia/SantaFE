import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';
import { TradeModule } from 'Trade/trade.module';
import { StructurePage } from 'Structure/structure.page';
import { NavigationModule } from 'Core/constants/coreConstants.constant';
import { StoreModule } from '@ngrx/store';
import { reducer } from 'Structure/reducers/structure.reducer';
import { StructureMainPanel } from 'Structure/containers/structure-main-panel.container';
import { StructureFund } from 'App/modules/structure/containers/structure-fund.container';
import { FormModule } from 'App/modules/form/form.module';
import { StructureUtilityPanel } from 'Structure/containers/structure-utility-panel.container';
import { TargetBar } from 'App/modules/structure/components/target-bar.component'
import { PortfolioBreakdown } from 'App/modules/structure/containers/portfolio-breakdown/portfolio-breakdown.container';

@NgModule({
  declarations: [
    StructurePage,
    StructureMainPanel,
    StructureFund,
    StructureUtilityPanel,
    TargetBar,
    PortfolioBreakdown
  ],
  imports: [
    // Angular framework modules
    CommonModule,
    StoreModule.forFeature(NavigationModule.structuring, reducer),
    RouterModule.forChild([
      {
        path: NavigationModule.structuring, component: StructurePage
      }
    ]),
    // Native modules
    CoreModule,
    TradeModule,  // this is here because of move visualizer, TODO: move Move Visualizer to core module and remove this dependency
    FormModule
  ]
})
export class StructureModule { }
