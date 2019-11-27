import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { FormModule } from 'App/modules/form/form.module';

import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';
import { GraphService } from 'Core/services/GraphService';
import { RestfulCommService } from 'Core/services/RestfulCommService';

import { SecurityCard } from 'Core/components/security-card/security-card.component';
import { QuantitativeComparer } from 'Core/components/quantitative-comparer/quantitative-comparer.component';
import { SecurityQuote } from 'Core/components/security-quote/security-quote.component';
import { SecurityTableRow } from 'Core/components/security-table-row/security-table-row.component';
import { SecurityDefinition } from 'Core/components/security-definition/security-definition.component';

import { SecurityTable } from 'Core/containers/security-table/security-table.container';

@NgModule({
  declarations: [
    SecurityCard,
    QuantitativeComparer,
    SecurityQuote,
    SecurityTable,
    SecurityTableRow,
    SecurityDefinition
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
    SecurityCard,
    SecurityTable,
    SecurityDefinition
  ]
})
export class CoreModule { }
