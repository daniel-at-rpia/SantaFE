import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';
import { StructurePage } from 'Structure/structure.page';
import { NavigationModule } from 'Core/constants/coreConstants.constant';

import { StructureMainPanel } from 'Structure/containers/structure-main-panel.container';
import { StructureFund } from 'App/modules/structure/containers/structure-fund.container';
import { FormModule } from 'App/modules/form/form.module';

@NgModule({
  declarations: [
    StructurePage,
    StructureMainPanel,
    StructureFund
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
    FormModule
  ]
})
export class StructureModule { }
