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
import { SecurityTable } from 'Core/components/security-table/security-table.component';
import { SecurityTradingMessage } from 'Core/components/security-trade-message/security-trading-message.component';

@NgModule({
  declarations: [
    SecurityCard,
    QuantitativeComparer,
    SecurityTable,
    SecurityTradingMessage
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
    QuantitativeComparer,
    SecurityTable,
    SecurityTradingMessage
  ]
})
export class CoreModule { }
