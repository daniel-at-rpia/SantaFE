    import {
      Component,
      ViewEncapsulation,
      Input,
      OnInit,
      OnChanges,
      OnDestroy
    } from '@angular/core';

    import { SantaTableSecurityCell } from 'Core/components/santa-table-security-cell/santa-table-security-cell.component';
    import { SecurityDTO } from 'FEModels/frontend-models.interface';
    import {
      GridApi,
      ColumnApi
    } from 'ag-grid-community';

@Component({
  selector: 'santa-table',
  templateUrl: './santa-table.container.html',
  styleUrls: ['./santa-table.container.scss'],
  encapsulation: ViewEncapsulation.Native
})

export class SantaTable implements OnInit, OnChanges {
  @Input() targetSecurity: SecurityDTO;
  @Input() securityList: Array<SecurityDTO>;

  agGridApi: GridApi;
  agGridColumnApi: ColumnApi;
  agGridColumnDefs = [];
  agGridRowData = [];
  agGridFrameworkComponents = {
    securityCard: SantaTableSecurityCell
  };
  agGridRowClassRules = "santaTable__row";

  public ngOnInit() {
    this.agGridColumnDefs = [
      {
        headerName: 'Security',
        field: 'securityCard',
        cellRenderer: "securityCard"
      },{
        headerName: 'WoW Delta',
        field: 'wow'
      },{
        headerName: 'MoM Delta',
        field: 'mom'
      },{
        headerName: 'YtD Delta',
        field: 'ytd'
      }
    ];
    this.agGridRowData = [];
  }

  public ngOnChanges() {
    console.log('test, at santa table, received list', this.securityList);
    if (!!this.securityList && this.securityList.length > 0) {
      const list = [];
      this.securityList.forEach((eachSecurity) => {
        const newRow = {
          id: eachSecurity.data.securityID,
          securityCard: eachSecurity,
          wow: eachSecurity.data.metricPack.delta.Wow['Default Spread'],
          mom: eachSecurity.data.metricPack.delta.Mom['Default Spread'],
          ytd: eachSecurity.data.metricPack.delta.Ytd['Default Spread']
        };
        list.push(newRow);
      });
      this.agGridApi.setRowData(list);
    }
  }

  public onGridReady(params) {
    this.agGridApi = params.api;
    this.agGridColumnApi = params.columnApi;
  }
}