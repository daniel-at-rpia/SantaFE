import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';
import { StructurePage } from 'Structure/structure.page';
import { NavigationModule } from 'Core/constants/coreConstants.constant';

import { StructureMainPanel } from 'Structure/containers/structure-main-panel.container';
import { StructureFund } from 'App/modules/structure/containers/structure-fund.container';
import { StructureUtilityPanel } from 'Structure/containers/structure-utility-panel.container';

@NgModule({
  declarations: [
    StructurePage,
    StructureMainPanel,
    StructureFund,
    StructureUtilityPanel
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
    CoreModule
  ]
})
export class StructureModule { }
