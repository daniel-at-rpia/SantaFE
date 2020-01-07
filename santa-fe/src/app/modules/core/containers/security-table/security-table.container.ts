  // dependencies
    import {
      Component,
      OnInit,
      OnChanges,
      ViewEncapsulation,
      Input,
      Output,
      EventEmitter
    } from '@angular/core';
    import {
      Observable,
      Subscription,
      of
    } from 'rxjs';
    import {
      tap,
      first,
      delay,
      catchError
    } from 'rxjs/operators';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';

    import {
      SecurityDTO,
      SecurityTableDTO,
      SecurityTableRowDTO,
      SecurityTableHeaderDTO
    } from 'FEModels/frontend-models.interface';
    import { QuoteMetricBlock } from 'FEModels/frontend-blocks.interface';
    import { PayloadGetAllQuotes } from 'BEModels/backend-payloads.interface';
    import { ClickedSortQuotesByMetricEmitterParams } from 'FEModels/frontend-adhoc-packages.interface';
    import { SecurityTableMetricStub } from 'FEModels/frontend-stub-models.interface';
    import { BEQuoteDTO } from 'BEModels/backend-models.interface';

    import {
      SECURITY_TABLE_FINAL_STAGE,
      THIRTY_DAY_DELTA_METRIC_INDEX
    } from 'Core/constants/securityTableConstants.constant';
  //

@Component({
  selector: 'security-table',
  templateUrl: './security-table.container.html',
  styleUrls: ['./security-table.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SecurityTable implements OnInit, OnChanges {
  @Input() tableData: SecurityTableDTO;
  @Input() securityTableMetrics: Array<SecurityTableMetricStub>;
  @Input() activeTriCoreMetric: string;
  @Output() selectedSecurityForAnalysis = new EventEmitter<SecurityDTO>();
  @Output() clickedSortQuotesByMetric = new EventEmitter<ClickedSortQuotesByMetricEmitterParams>();
  @Output() nativeTableFetchQuotes = new EventEmitter<SecurityTableRowDTO>();
  @Output() nativeLoadTableHeader = new EventEmitter();
  @Output() nativePerformSort = new EventEmitter<SecurityTableHeaderDTO>();
  @Output() nativePerformDefaultSort = new EventEmitter();

  constants = {
    securityTableFinalStage: SECURITY_TABLE_FINAL_STAGE,
    thirtyDayDeltaIndex: THIRTY_DAY_DELTA_METRIC_INDEX
  }

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ) { }

  public ngOnInit() {
  }

  public ngOnChanges() {
    // no need to handle all that detection logic, santa table is handling it
  }

  public onClickHeaderCTA(targetHeader: SecurityTableHeaderDTO) {
    if (targetHeader.state.isQuantVariant) {
      this.tableData.state.selectedHeader = this.tableData.state.selectedHeader && this.tableData.state.selectedHeader.data.displayLabel === targetHeader.data.displayLabel ? null : targetHeader;
    } else {
      this.onClickSortBy(targetHeader);
    }
  }

  public onClickRemoveHeader(targetHeader: SecurityTableHeaderDTO) {
    const targetIndex = this.tableData.data.headers.indexOf(targetHeader);
    this.tableData.state.selectedHeader = null;
    this.securityTableMetrics.forEach((eachStub) => {
      if (eachStub.label === targetHeader.data.displayLabel) {
        eachStub.active = false;
      }
    });
    if (targetIndex > 0) {
      if (this.tableData.state.sortedByHeader === targetHeader) {
        this.tableData.state.sortedByHeader = null;
        this.nativePerformDefaultSort.emit();
      }
      this.tableData.data.headers.splice(targetIndex, 1);
      this.tableData.data.rows.forEach((eachRow) => {
        eachRow.data.cells.splice(targetIndex-1, 1);
      });
    }
  }

  public onClickShowAddColumnDropdown() {
    this.tableData.state.isAddingColumn = !this.tableData.state.isAddingColumn;
  }

  public onCollapseAddColumnDropdown() {
    this.tableData.state.isAddingColumn = false;
  }

  public onClickAddHeader(targetStub: SecurityTableMetricStub) {
    if (!targetStub.disabled) {
      if (!targetStub.active) {
        targetStub.active = true;
        this.nativeLoadTableHeader.emit();
        this.loadTableRowsUponHeaderChange();
        this.onCollapseAddColumnDropdown();
      } else {
        const targetHeader = this.tableData.data.headers.find((eachHeader) => {
          return targetStub.label === eachHeader.data.displayLabel;
        })
        !!targetHeader && this.onClickRemoveHeader(targetHeader);
        this.onCollapseAddColumnDropdown();
      }
    }
  }

  public onClickSortBy(targetHeader: SecurityTableHeaderDTO) {
    this.tableData.state.sortedByHeader = this.tableData.state.sortedByHeader && this.tableData.state.sortedByHeader.data.displayLabel === targetHeader.data.displayLabel ? null : targetHeader;
    this.tableData.state.selectedHeader = null;
    if (this.tableData.state.loadedContentStage >= 2) {
      if (this.tableData.state.sortedByHeader) {
        this.nativePerformSort.emit(this.tableData.state.sortedByHeader);
      } else {
        this.nativePerformDefaultSort.emit();
      }
    }
  }

  public onClickToggleQuantAxeSkew(targetHeader: SecurityTableHeaderDTO) {
    if (targetHeader.state.isQuantVariant) {
      targetHeader.state.isAxeSkewEnabled = !targetHeader.state.isAxeSkewEnabled;
      if (this.tableData.state.loadedContentStage >= 2) {
        this.applySkewToggleToRows(targetHeader, true);
      }
    }
    this.tableData.state.selectedHeader = null;
  }

  public onClickToggleQuantSkew(targetHeader: SecurityTableHeaderDTO, isAxe: boolean) {
    if (targetHeader.state.isQuantVariant) {
      if (isAxe) {
        targetHeader.state.isAxeSkewEnabled = !targetHeader.state.isAxeSkewEnabled;
      } else {
        targetHeader.state.istotalSkewEnabled = !targetHeader.state.istotalSkewEnabled;
      }
      if (this.tableData.state.loadedContentStage >= 2) {
        this.applySkewToggleToRows(targetHeader, isAxe);
      }
    }
    this.tableData.state.selectedHeader = null;
  }

  public onClickCollapseExpandView(targetRow: SecurityTableRowDTO) {
    targetRow.state.isExpanded = false;
    targetRow.data.security.state.isTableExpanded = false;
  }

  public onClickRowTableCanvas(targetRow: SecurityTableRowDTO) {
    if (this.tableData.state.loadedContentStage === this.constants.securityTableFinalStage) {
      targetRow.state.isExpanded = !targetRow.state.isExpanded;
      targetRow.data.security.state.isTableExpanded = targetRow.state.isExpanded;
      if (targetRow.state.isExpanded) {
        this.fetchSecurityQuotes(targetRow);
      }
    }
  }

  public onClickSortQuotesByMetric(payload: ClickedSortQuotesByMetricEmitterParams) {
    this.clickedSortQuotesByMetric.emit(payload);
  }

  public onClickSelectForAnalysis(targetRow: SecurityTableRowDTO) {
    this.selectedSecurityForAnalysis.emit(targetRow.data.security)
  }

  private loadTableRowsUponHeaderChange() {
    this.tableData.data.headers.forEach((eachHeader, index) => {
      if (!eachHeader.state.isPureTextVariant && !eachHeader.state.isQuantVariant) {
        this.tableData.data.rows.forEach((eachRow) => {
          const targetCell = eachRow.data.cells[index-1];
          if (!!targetCell) {
            this.utilityService.populateSecurityTableCellFromSecurityCard(
              eachHeader,
              eachRow,
              targetCell,
              this.activeTriCoreMetric
            );
          } else {
            const newCell = this.utilityService.populateSecurityTableCellFromSecurityCard(
              eachHeader,
              eachRow,
              this.dtoService.formSecurityTableCellObject(false, null, false),
              this.activeTriCoreMetric
            );
            eachRow.data.cells[index-1] = newCell;
          }
        });
      }
    });
  }

  private fetchSecurityQuotes(targetRow: SecurityTableRowDTO){
    this.nativeTableFetchQuotes.emit(targetRow); 
  }

  private applySkewToggleToRows(targetHeader: SecurityTableHeaderDTO, isAxe: boolean) {
    const columnIndex = this.tableData.data.headers.indexOf(targetHeader) - 1;
    this.tableData.data.rows.forEach((eachRow) => {
      const targetQuant = eachRow.data.cells[columnIndex].data.quantComparerDTO;
      if (!!targetQuant) {
        if (isAxe) {
          targetQuant.state.axeSkewEnabled = targetHeader.state.isAxeSkewEnabled;
        } else {
          targetQuant.state.totalSkewEnabled = targetHeader.state.istotalSkewEnabled;
        }
      }
    });
  }
  
  private liveUpdateAllQuotesForExpandedRows() {
    this.tableData.data.rows.forEach((eachRow) => {
      if (eachRow.state.isExpanded) {
        this.fetchSecurityQuotes(eachRow);
      }
    })
  }
}
