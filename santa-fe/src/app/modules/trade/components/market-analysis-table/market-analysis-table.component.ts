    import {
      Component,
      ViewEncapsulation,
      Input,
      OnInit,
      OnDestroy
    } from '@angular/core';

    import { SecurityCard } from 'Core/components/security-card/security-card.component';
    import { SecurityDTO } from 'FEModels/frontend-models.interface';

@Component({
  selector: 'market-analysis-table',
  templateUrl: './market-analysis-table.component.html',
  styleUrls: ['./market-analysis-table.component.scss'],
  encapsulation: ViewEncapsulation.Native
})

export class TradeMarketAnalysisTable implements OnInit {
  @Input() targetSecurity: SecurityDTO;
  rowData = [];
  columnDefs = [];
  frameworkComponents = null;

  public ngOnInit() {
    this.columnDefs = [
        {headerName: 'Make', field: 'make' },
        {headerName: 'Model', field: 'model' },
        {headerName: 'Price', field: 'price', width: 350, cellRenderer: "securityCard"}
    ];

    this.rowData = [
      { make: 'Toyota', model: 'Celica', price: 35000 },
      { make: 'Ford', model: 'Mondeo', price: 32000 },
      { make: 'Porsche', model: 'Boxter', price: 72000 },
      this.targetSecurity
    ];
    this.frameworkComponents = {
      securityCard: SecurityCard
    }
  }
}