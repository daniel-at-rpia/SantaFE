  // dependencies
    import {
      Component,
      ViewEncapsulation,
      Input,
      OnChanges
    } from '@angular/core';

    import { DTOService } from 'Core/services/DTOService';
    import { UtilityService } from 'Core/services/UtilityService';
    import { RestfulCommService } from 'Core/services/RestfulCommService';
    import {
      SecurityDTO,
      MoveVisualizerDTO,
      HistoricalSummaryDTO
    } from 'FEModels/frontend-models.interface';
    import {
      HISTORICAL_SUMMARY_ROUNDING
    } from 'Core/constants/tradeConstants.constant';
  //

@Component({
  selector: 'historical-summary',
  templateUrl: './historical-summary.container.html',
  styleUrls: ['./historical-summary.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class HistoricalSummary implements OnChanges {
  @Input() summaryData: HistoricalSummaryDTO;
  subscriptions = {
  }
  constants = {
  };

  constructor(
    private dtoService: DTOService,
    private utilityService: UtilityService,
    private restfulCommService: RestfulCommService
  ){

  }

  public ngOnChanges() {
    if (this.summaryData.data.list.length > 0 && !this.summaryData.state.isStencil) {
      this.calculateMoveVisualizerStyle();
    }
  }

  public hoveringSummary(event) {
    if (!!event && !!event.srcElement && event.srcElement.className === 'sat-moveVisualizer__positionDetection') {
      // console.log('mouse move', event.offsetX, event);
      const totalWidth = event.srcElement.offsetWidth;
      const currentPosition = event.offsetX === totalWidth - 1 ? totalWidth : event.offsetX;
      this.summaryData.data.rulerValue = this.utilityService.round(currentPosition * this.summaryData.data.globalDistance / totalWidth + this.summaryData.data.globalMin, 0);

      this.summaryData.style.rulerPosition = currentPosition;
    } else {
      console.warn('invalid hover', event);
    }

  }

  private calculateMoveVisualizerStyle() {
    // const theoreticalMax = this.summaryData.data.centerPoint + this.summaryData.data.globalDistance;
    // const theoreticalMin = this.summaryData.data.centerPoint - this.summaryData.data.globalDistance;
    // let globalMin = theoreticalMax;
    // let globalMax = theoreticalMin;
    // let minimumTotalDistance = null;
    // this.summaryData.data.list.forEach((eachMoveVisualizer) => {
    //   const totalDistance = eachMoveVisualizer.data.max - eachMoveVisualizer.data.min;
    //   if (minimumTotalDistance === null || minimumTotalDistance > totalDistance) {
    //     minimumTotalDistance = totalDistance;
    //   }
    // });
    // let globalMin = this.summaryData.data.centerPoint - minimumTotalDistance * 10;
    // let globalMax = this.summaryData.data.centerPoint + minimumTotalDistance * 10;
    let globalMin = null;
    let globalMax = null;
    this.summaryData.data.list.forEach((eachMoveVisualizer) => {
      if (!eachMoveVisualizer.state.isPlaceholder && !eachMoveVisualizer.state.isInvalid) {
        if (globalMin === null || eachMoveVisualizer.data.min < globalMin) {
          globalMin = eachMoveVisualizer.data.min;
        }
        if (globalMax === null || eachMoveVisualizer.data.max > globalMax) {
          globalMax = eachMoveVisualizer.data.max;
        }
      }
    });
    const globalDistance = Math.abs(globalMax - globalMin);
    this.summaryData.data.globalMin = globalMin;
    this.summaryData.data.globalMax = globalMax;
    this.summaryData.data.globalDistance = globalDistance;
    console.log('test, min and max are', globalMin, globalMax);
    this.summaryData.data.list.forEach((eachMoveVisualizer) => {
      if (!eachMoveVisualizer.state.isPlaceholder) {
        const leftNode = eachMoveVisualizer.data.start <= eachMoveVisualizer.data.end ? eachMoveVisualizer.data.start : eachMoveVisualizer.data.end;
        const rightNode = eachMoveVisualizer.data.start >eachMoveVisualizer.data.end ? eachMoveVisualizer.data.start : eachMoveVisualizer.data.end;

        const leftSpace = globalMin < eachMoveVisualizer.data.min ? globalMin - eachMoveVisualizer.data.min : 0;
        const distance = eachMoveVisualizer.data.end - eachMoveVisualizer.data.start;
        const rightSpace = globalMax > eachMoveVisualizer.data.max ? globalMax - eachMoveVisualizer.data.max : 0;
        eachMoveVisualizer.style.leftGap = this.utilityService.round(Math.abs(leftSpace) / globalDistance * 100, HISTORICAL_SUMMARY_ROUNDING);
        eachMoveVisualizer.style.leftEdge = this.utilityService.round(Math.abs(eachMoveVisualizer.data.min - leftNode) / globalDistance * 100, HISTORICAL_SUMMARY_ROUNDING);
        eachMoveVisualizer.style.moveDistance = this.utilityService.round(Math.abs(distance) / globalDistance * 100, HISTORICAL_SUMMARY_ROUNDING);
        eachMoveVisualizer.style.rightEdge = this.utilityService.round(Math.abs(eachMoveVisualizer.data.max - rightNode) / globalDistance * 100, HISTORICAL_SUMMARY_ROUNDING);
        eachMoveVisualizer.style.rightGap = this.utilityService.round(Math.abs(rightSpace) / globalDistance * 100, HISTORICAL_SUMMARY_ROUNDING);
        eachMoveVisualizer.style.endPinLocation = eachMoveVisualizer.state.isInversed ? eachMoveVisualizer.style.leftEdge + eachMoveVisualizer.style.leftGap : eachMoveVisualizer.style.leftEdge + eachMoveVisualizer.style.leftGap + eachMoveVisualizer.style.moveDistance;
        console.log('test, ', leftNode, rightNode, leftSpace, distance, rightSpace, eachMoveVisualizer);
      }
    });
  }

}