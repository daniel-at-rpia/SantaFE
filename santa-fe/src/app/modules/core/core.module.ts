import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FormModule } from 'App/modules/form/form.module';

import { DTOService } from 'Core/services/DTOService';
import { UtilityService } from 'Core/services/UtilityService';
import { GraphService } from 'Core/services/GraphService';
import { RestfulCommService } from 'Core/services/RestfulCommService';
import { AgGridMiddleLayerService } from 'Core/services/AgGridMiddleLayerService';

import { AgGridModule } from 'ag-grid-angular';

import { SecurityCard } from 'Core/containers/security-card/security-card.container';
import { QuantitativeComparer } from 'Core/components/quantitative-comparer/quantitative-comparer.component';
import { SecurityQuote } from 'Core/components/security-quote/security-quote.component';
import { SecurityTableRow } from 'Core/components/security-table-row/security-table-row.component';
import { SecurityDefinition } from 'Core/components/security-definition/security-definition.component';
import { SearchShortcut } from 'Core/components/search-shortcut/search-shortcut.component';

import { SecurityDefinitionConfigurator } from 'Core/containers/security-definition-configurator/security-definition-configurator.container';
import { SecurityTable } from 'Core/containers/security-table/security-table.container';
import { SantaTable } from 'Core/containers/santa-table/santa-table.container';
import { SantaTableSecurityCell } from 'Core/components/santa-table-security-cell/santa-table-security-cell.component';
import { SantaTableQuoteCell } from 'Core/components/santa-table-quote-cell/santa-table-quote-cell.component';
import { SantaTableAlertSideCell } from 'Core/components/santa-table-alert-side-cell/santa-table-alert-side-cell.component';
import { SantaTableDetailAllQuotes } from 'Core/containers/santa-table-detail-all-quotes/santa-table-detail-all-quotes.container';
import { SantaTableNumericFloatingFilter } from 'Core/components/santa-table-numeric-floating-filter/santa-table-numeric-floating-filter.component';
import { SantaTableNumericFilter } from 'Core/components/santa-table-numeric-filter/santa-table-numeric-filter.component';
import { NumericFilter } from 'Core/components/numeric-filter/numeric-filter.component';
import { GlobalAlert } from 'Core/containers/global-alert/global-alert.container';
import { Alert } from 'Core/components/alert/alert.component';
import { CountdownPipe } from 'App/pipes/Countdown.pipe';
import { HistoricalTradeVisualizer } from 'Core/containers/historical-trade-visualizer/historical-trade-visualizer.container';
import { SantaTableAlertStatusCell } from 'Core/components/santa-table-alert-status-cell/santa-table-alert-status-cell.component';
import { SantaTableFullWidthCellRenderer } from 'Core/components/santa-table-full-width-cell-renderer/santa-table-full-width-cell-renderer.component';

@NgModule({
  declarations: [
    CountdownPipe,
    SecurityCard,
    QuantitativeComparer,
    SecurityQuote,
    SecurityTable,
    SecurityTableRow,
    SecurityDefinition,
    SecurityDefinitionConfigurator,
    SearchShortcut,
    SantaTable,
    SantaTableSecurityCell,
    SantaTableQuoteCell,
    SantaTableAlertSideCell,
    SantaTableDetailAllQuotes,
    SantaTableNumericFilter,
    SantaTableNumericFloatingFilter,
    NumericFilter,
    GlobalAlert,
    Alert,
    HistoricalTradeVisualizer,
    SantaTableAlertStatusCell,
    SantaTableFullWidthCellRenderer
  ],
    imports: [
        CommonModule,
        FormsModule,

        AgGridModule.withComponents([
            SantaTableSecurityCell,
            SantaTableQuoteCell,
            SantaTableAlertSideCell,
            SantaTableDetailAllQuotes,
            SantaTableNumericFilter,
            SantaTableNumericFloatingFilter,
            SantaTableAlertStatusCell,
            SantaTableFullWidthCellRenderer
        ]),

        FormModule
    ],
  providers: [
    DTOService,
    UtilityService,
    GraphService,
    RestfulCommService,
    AgGridMiddleLayerService,
    CountdownPipe
  ],
    exports: [
        SantaTable,
        SecurityCard,
        SecurityTable,
        SecurityDefinition,
        SecurityDefinitionConfigurator,
        SearchShortcut,
        GlobalAlert,
        Alert,
        NumericFilter
    ]
})
export class CoreModule { }
