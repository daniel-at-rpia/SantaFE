import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from 'Core/core.module';
import { StructurePage } from 'Structure/structure.page';
import { NavigationModule } from 'Core/constants/coreConstants.constant';

@NgModule({
  declarations: [
    StructurePage
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
