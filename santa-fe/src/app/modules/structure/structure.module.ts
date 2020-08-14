import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';
import { StructurePage } from 'Structure/structure.page';

import { StructureMainPanel } from 'Structure/containers/structure-main-panel.container';
import { StructureFund } from 'App/modules/structure/containers/structure-fund.container';
import { PortfolioBreakdown } from 'App/modules/structure/containers/portfolio-breakdown/portfolio-breakdown.container';

@NgModule({
  declarations: [
    StructurePage,
    StructureMainPanel,
    StructureFund,
    PortfolioBreakdown
  ],
  imports: [
    // Angular framework modules
    CommonModule,
    RouterModule.forChild([
      {
        path: 'structure', component: StructurePage
      }
    ]),

    // Native modules
    CoreModule
  ]
})
export class StructureModule { }
