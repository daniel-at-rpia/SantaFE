import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FormModule } from 'App/modules/form/form.module';

import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';
import { GraphService } from 'Core/services/GraphService';
import { RestfulCommService } from 'Core/services/RestfulCommService';

import { SecurityCard } from 'Core/components/security-card/security-card.component';

@NgModule({
  declarations: [
    SecurityCard
  ],
  imports: [
    CommonModule,
    FormModule
  ],
  providers: [
    DTOService,
    UtilityService,
    GraphService,
    RestfulCommService
  ], 
  exports: [
    SecurityCard
  ]
})
export class CoreModule { }
