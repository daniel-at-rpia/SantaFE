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
import { StructureSetTargetPanel } from 'Structure/containers/structure-set-target-panel/structure-set-target-panel.container';
import { StructureSetBulkOverrides } from 'App/modules/structure/containers/structure-set-bulk-overrides-panel/structure-set-bulk-overrides-panel.container';
import { PortfolioBreakdownRow } from 'App/modules/structure/components/portfolio-breakdown-row.component';
import { StructurePopover } from 'Structure/containers/structure-popover/structure-popover.container';

@NgModule({
  declarations: [
    StructurePage,
    StructureMainPanel,
    StructureFund,
    StructureUtilityPanel,
    TargetBar,
    PortfolioBreakdown,
    StructureSetTargetPanel,
    PortfolioBreakdownRow,
    StructurePopover,
    StructureSetBulkOverrides
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
    FormModule
  ],
  providers: [
  ]
})
export class StructureModule { }
