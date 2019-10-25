import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FormModule } from 'App/modules/form/form.module';

import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';
import { GraphService } from 'Core/services/GraphService';
import { RestfulCommService } from 'Core/services/RestfulCommService';

@NgModule({
  declarations: [
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
  ]
})
export class CoreModule { }
