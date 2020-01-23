import { Injectable } from '@angular/core';
import { UtilityService } from './UtilityService';
import {
  SecurityGroupPieChartBlock,
  SecurityGroupPieChartDataBlock,
  ObligorChartCategoryBlock
} from 'FEModels/frontend-blocks.interface';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_regression from "@amcharts/amcharts4/plugins/regression";
import { TradeObligorGraphPanelState } from 'FEModels/frontend-page-states.interface';
import { ObligorGraphCategoryData, ObligorGraphAxesZoomState } from 'src/app/modules/core/models/frontend/frontend-adhoc-packages.interface';
import { MIN_OBLIGOR_CURVE_VALUES } from 'src/app/modules/core/constants/coreConstants.constant'


@Injectable()
export class GraphService {
  constructor(
    private utility: UtilityService
  ) { }

  public generateSecurityGroupPieChart(
    pieChartDTO: SecurityGroupPieChartBlock,
  ): am4charts.PieChart {
    const chart = am4core.create(pieChartDTO.name, am4charts.PieChart);
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields = {
      "value": "value",
      "category": "label"
    };
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;
    pieSeries.tooltip.disabled = true;
    pieSeries.slices.template.stroke = am4core.color(`#fff`);
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template.strokeWidth = 1;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{category}";
    pieSeries.labels.template.fontFamily = "SantaOpenSans";
    pieSeries.labels.template.fontWeight = "300";
    pieSeries.labels.template.fontSize = 1;  // this is not working
    chart.fontSize = 1;  // this is not working
    pieSeries.labels.template.radius = am4core.percent(-40);
    if (pieChartDTO.colorScheme.type === 'Seniority') {
      pieSeries.labels.template.fill = am4core.color("#333");
    } else {
      pieSeries.labels.template.fill = am4core.color("white");
    }
    //pieSeries.slices.template.states.getKey("hover").properties.innerRadius = 0.2;
    pieSeries.slices.template.states.getKey("hover").properties.scale = 1;
    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries.innerRadius = am4core.percent(60);
    const data = this.generateGroupPieChartData(pieChartDTO);
    chart.data = data;
    //chart.innerRadius = 1;
    //chart.defaultState.properties.innerRadius = am4core.percent(2);
    //chart.hiddenState.properties.innerRadius = 0.2;
    //pieSeries.innerRadius = am4core.percent(0);
    //pieSeries.hiddenState.properties.innerRadius = am4core.percent(10);
    //pieSeries.defaultState.properties.innerRadius = am4core.percent(100);
    //pieSeries.hiddenState.properties.innerRadius = am4core.percent(50);
    //const parentSelectedState = chart.states.create("selected");
    //parentSelectedState.properties.innerRadius = 1;
    const selectedState = pieSeries.states.create("selected");
    //chart.setState("default");
    return chart;
  }

  public changeSecurityGroupPieChartOnSelect(
    pieChartDTO: SecurityGroupPieChartBlock,
    isSelected: boolean
  ) {
    const chart = pieChartDTO.chart;
    const pieSeries = chart.series.getIndex(0);
    const activeSpacingColor = pieChartDTO.colorScheme.scheme[0].value;
    const defaultSpacingColor = '#fff';
    if (isSelected) {
      //chart.setState("hidden", 300);
      pieSeries.labels.template.disabled = false;
      pieSeries.slices.template.stroke = am4core.color(activeSpacingColor);
      pieSeries.setState("selected", 300);
    } else {
      //chart.setState("default", 300);
      pieSeries.labels.template.disabled = true;
      pieSeries.slices.template.stroke = am4core.color(defaultSpacingColor);
      pieSeries.setState("default", 300);
    }
  }

  private generateGroupPieChartData(
    pieChartDTO: SecurityGroupPieChartBlock
  ): Array<SecurityGroupPieChartDataBlock> {
    const colorScheme = pieChartDTO.colorScheme.scheme;
    const dataList: Array<SecurityGroupPieChartDataBlock> = [];
    //if (pieChartDTO.colorScheme.type === 'Rating') {
    for (const attrName in pieChartDTO.rawSupportingData) {
      const colorMappingIndex = this.findColorMapping(pieChartDTO.colorScheme.type, attrName);
      const newEntry: SecurityGroupPieChartDataBlock = {
        label: pieChartDTO.colorScheme.type === 'Seniority' ? this.utility.convertSenioritiesToAcronyms(attrName) : attrName,
        value: this.utility.retrieveValueForGroupPieChartFromSupportingData(pieChartDTO.rawSupportingData[attrName]),
        index: colorMappingIndex,
        color: am4core.color(colorScheme[colorMappingIndex].value)
      };
      const existEntry = dataList.find((eachEntry) => {
        return colorScheme[eachEntry.index].value === colorScheme[newEntry.index].value;
      });
      if (!!existEntry) {
        existEntry.value = existEntry.value + newEntry.value;
      } else {
        dataList.push(newEntry);
      }
    };
    // } else if (pieChartDTO.colorScheme.type === 'Seniority') {
    //   for (const attrName in pieChartDTO.rawSupportingData) {

    //   }
    // }
    return dataList
  }

  private findColorMapping(colorScheme: string, attrName: string): number {
    if (colorScheme === 'Rating') {
      return this.utility.mapRatings(attrName);
    } else if (colorScheme === 'Seniority') {
      return this.utility.mapSeniorities(attrName);
    }
  }

  public clearGraphSeries(chart: am4charts.XYChart) {
    chart.series.clear();

    return chart;
  }

  public buildObligorChart(state: TradeObligorGraphPanelState) {
    // Initialize the chart as XY.
    state.obligorChart = am4core.create("chartdiv", am4charts.XYChart);

    let xAxis = this.initializeObligorChartXAxis(state);
    let yAxis = this.initializeObligorChartYAxis(state);

    // Draw each chart category.
    state.chartCategories.forEach((eachCategory) => {
      this.addCategoryToObligorGraph(eachCategory, state);
    });

    // Add legend for each chart type.
    state.obligorChart.legend = new am4charts.Legend();

    // Build the reset ( zoomOutButton )
    // TODO: Move this to another method.
    let resetButtonContainer = state.obligorChart.plotContainer.createChild(am4core.Container);
    resetButtonContainer.shouldClone = false;
    resetButtonContainer.align = "left";
    resetButtonContainer.valign = "top";
    resetButtonContainer.marginTop = 0;
    resetButtonContainer.zIndex = Number.MAX_SAFE_INTEGER;
    resetButtonContainer.draggable = true;

    let resetButton = resetButtonContainer.createChild(am4core.Button);
    resetButton.label.text = "-";
    resetButton.background.fill = am4core.color('#bdbdbd');
    resetButton.stroke = am4core.color('#000000');

    // Reset button click event.
    resetButton.events.on("hit", function (ev) {
      if (state.axesZoomState.xAxis.fullZoomStart !== null && state.axesZoomState.xAxis.fullZoomEnd !== null) {
        xAxis.zoomToValues(state.axesZoomState.xAxis.fullZoomStart, state.axesZoomState.xAxis.fullZoomEnd);
      }
      if (state.axesZoomState.yAxis.fullZoomStart !== null && state.axesZoomState.yAxis.fullZoomEnd !== null) {
        yAxis.zoomToValues(state.axesZoomState.yAxis.fullZoomStart, state.axesZoomState.yAxis.fullZoomEnd);
      }
    });

    // Initialize trigger events for chart legend
    this.initializeObligorChartTriggerEvents(state, xAxis, yAxis);

    // Add a cursor to the chart, with zoom behaviour. 
    state.obligorChart.cursor = new am4charts.XYCursor();
    state.obligorChart.cursor.behavior = "panXY";
    state.obligorChart.mouseWheelBehavior = "zoomXY";
    state.obligorChart.mouseOptions.sensitivity = 1;
    state.obligorChart.cursor.lineX.disabled = true;
    state.obligorChart.cursor.lineY.disabled = true;
    state.obligorChart.zoomOutButton.disabled = true;
  }

  public addCategoryToObligorGraph(category: ObligorChartCategoryBlock, state: TradeObligorGraphPanelState) {
    // Create data array that can be handled by amCharts from out category DataItems.
    let amChartsData: any[] = this.buildObligorChartData(category, state);

    if (amChartsData.length > 0) {
      // Create a dumbbell series.
      let dumbBellSeries: am4charts.ColumnSeries = this.buildObligorChartDumbells(state, category, amChartsData);

      if (amChartsData.length > MIN_OBLIGOR_CURVE_VALUES) {
        // Create a trend curve.
        let curveSeries: am4charts.LineSeries = this.buildObligorChartTrendCurve(state, category, amChartsData, dumbBellSeries);
      }
    }
  }

  public captureXYChartCurrentZoomState(chart: any, state: TradeObligorGraphPanelState): ObligorGraphAxesZoomState {
    // Capture the current axes zoom state in out Zoom State object.
    // This is not used, but here when we need it.
    let currentState: ObligorGraphAxesZoomState;
    currentState = {
      xAxis: {
        start: chart.xAxes.values[0].minZoomed,
        end: chart.xAxes.values[0].maxZoomed,
        fullZoomStart: state.axesZoomState.xAxis.fullZoomStart,
        fullZoomEnd: state.axesZoomState.xAxis.fullZoomEnd,
      },
      yAxis: {
        start: chart.yAxes.values[0].minZoomed,
        end: chart.yAxes.values[0].maxZoomed,
        fullZoomStart: state.axesZoomState.yAxis.fullZoomStart,
        fullZoomEnd: state.axesZoomState.yAxis.fullZoomEnd,
      }
    }
    return currentState;
  }

  public buildObligorChartData(category: ObligorChartCategoryBlock, state: TradeObligorGraphPanelState): any[] {
    let amChartsData: ObligorGraphCategoryData[] = [];

    for (let dataItem in category.data.obligorCategoryDataItemDTO) {

      let mid: number;
      if (state.metric.spread) mid = category.data.obligorCategoryDataItemDTO[dataItem].data.spreadMid;
      else if (state.metric.yield) mid = category.data.obligorCategoryDataItemDTO[dataItem].data.yieldMid;

      if (mid !== 0) {

        // The dumbbell chart will not work if the mark is null. If it is, we will set it to the value of mid to be "hidden" behind it.
        let mark: number;
        if (category.data.obligorCategoryDataItemDTO[dataItem].data.mark === null && mid !== null) mark = mid;
        else mark = Number(category.data.obligorCategoryDataItemDTO[dataItem].data.mark);

        // Set the value of of the markQuantity. Can be either CS01 or Quantity
        let markQuantity: number;
        if (state.markValue.cS01) markQuantity = category.data.obligorCategoryDataItemDTO[dataItem].data.cS01
        else if (state.markValue.quantity) markQuantity = category.data.obligorCategoryDataItemDTO[dataItem].data.currentPosition

        //TODO: After being more familiar with amcharts, I don't think we need a seperate object for this.
        // We can probably find a way to send in ObligorChartCategoryBlock to create the series. I'm not entirely sure if it will work. But worth looking into.
        // This whole method would be removed, and it would get rid of some duplication.
        if (mid !== null)
          amChartsData.push({
            name: category.data.obligorCategoryDataItemDTO[dataItem].data.name,
            mid: mid,
            mark: mark,
            workoutTerm: category.data.obligorCategoryDataItemDTO[dataItem].data.workoutTerm,
            markQuantity: markQuantity
          })
      }
    }
    return amChartsData;
  }

  // Daniel wrote this
  public buildLilMarketTimeSeriesGraph() {
    const chart = am4core.create('LilMarketGraph', am4charts.XYChart);// Add data
    chart.data = [
      {
        "date": "2012-07-27",
        "value": 13
      }, {
        "date": "2012-07-28",
        "value": 11
      }, {
        "date": "2012-07-29",
        "value": 15
      }, {
        "date": "2012-07-30",
        "value": 16
      }, {
        "date": "2012-07-31",
        "value": 18
      }, {
        "date": "2012-08-01",
        "value": 13
      }, {
        "date": "2012-08-02",
        "value": 22
      }, {
        "date": "2012-08-03",
        "value": 23
      }, {
        "date": "2012-08-04",
        "value": 20
      }, {
        "date": "2012-08-05",
        "value": 17
      }, {
        "date": "2012-08-06",
        "value": 16
      }, {
        "date": "2012-08-07",
        "value": 18
      }, {
        "date": "2012-08-08",
        "value": 21
      }, {
        "date": "2012-08-09",
        "value": 26
      }, {
        "date": "2012-08-10",
        "value": 24
      }, {
        "date": "2012-08-11",
        "value": 29
      }, {
        "date": "2012-08-12",
        "value": 32
      }, {
        "date": "2012-08-13",
        "value": 18
      }, {
        "date": "2012-08-14",
        "value": 24
      }, {
        "date": "2012-08-15",
        "value": 22
      }, {
        "date": "2012-08-16",
        "value": 18
      }, {
        "date": "2012-08-17",
        "value": 19
      }, {
        "date": "2012-08-18",
        "value": 14
      }, {
        "date": "2012-08-19",
        "value": 15
      }, {
        "date": "2012-08-20",
        "value": 12
      }, {
        "date": "2012-08-21",
        "value": 8
      }, {
        "date": "2012-08-22",
        "value": 9
      }, {
        "date": "2012-08-23",
        "value": 8
      }, {
        "date": "2012-08-24",
        "value": 7
      }, {
        "date": "2012-08-25",
        "value": 5
      }, {
        "date": "2012-08-26",
        "value": 11
      }, {
        "date": "2012-08-27",
        "value": 13
      }, {
        "date": "2012-08-28",
        "value": 18
      }, {
        "date": "2012-08-29",
        "value": 20
      }, {
        "date": "2012-08-30",
        "value": 29
      }, {
        "date": "2012-08-31",
        "value": 33
      }, {
        "date": "2012-09-01",
        "value": 42
      }, {
        "date": "2012-09-02",
        "value": 35
      }, {
        "date": "2012-09-03",
        "value": 31
      }, {
        "date": "2012-09-04",
        "value": 47
      }, {
        "date": "2012-09-05",
        "value": 52
      }, {
        "date": "2012-09-06",
        "value": 46
      }, {
        "date": "2012-09-07",
        "value": 41
      }, {
        "date": "2012-09-08",
        "value": 43
      }, {
        "date": "2012-09-09",
        "value": 40
      }, {
        "date": "2012-09-10",
        "value": 39
      }, {
        "date": "2012-09-11",
        "value": 34
      }, {
        "date": "2012-09-12",
        "value": 29
      }, {
        "date": "2012-09-13",
        "value": 34
      }, {
        "date": "2012-09-14",
        "value": 37
      }, {
        "date": "2012-09-15",
        "value": 42
      }, {
        "date": "2012-09-16",
        "value": 49
      }, {
        "date": "2012-09-17",
        "value": 46
      }, {
        "date": "2012-09-18",
        "value": 47
      }, {
        "date": "2012-09-19",
        "value": 55
      }, {
        "date": "2012-09-20",
        "value": 59
      }, {
        "date": "2012-09-21",
        "value": 58
      }, {
        "date": "2012-09-22",
        "value": 57
      }, {
        "date": "2012-09-23",
        "value": 61
      }, {
        "date": "2012-09-24",
        "value": 59
      }, {
        "date": "2012-09-25",
        "value": 67
      }, {
        "date": "2012-09-26",
        "value": 65
      }, {
        "date": "2012-09-27",
        "value": 61
      }, {
        "date": "2012-09-28",
        "value": 66
      }, {
        "date": "2012-09-29",
        "value": 69
      }, {
        "date": "2012-09-30",
        "value": 71
      }, {
        "date": "2012-10-01",
        "value": 67
      }, {
        "date": "2012-10-02",
        "value": 63
      }, {
        "date": "2012-10-03",
        "value": 46
      }, {
        "date": "2012-10-04",
        "value": 32
      }, {
        "date": "2012-10-05",
        "value": 21
      }, {
        "date": "2012-10-06",
        "value": 18
      }, {
        "date": "2012-10-07",
        "value": 21
      }, {
        "date": "2012-10-08",
        "value": 28
      }, {
        "date": "2012-10-09",
        "value": 27
      }, {
        "date": "2012-10-10",
        "value": 36
      }, {
        "date": "2012-10-11",
        "value": 33
      }, {
        "date": "2012-10-12",
        "value": 31
      }, {
        "date": "2012-10-13",
        "value": 30
      }, {
        "date": "2012-10-14",
        "value": 34
      }, {
        "date": "2012-10-15",
        "value": 38
      }, {
        "date": "2012-10-16",
        "value": 37
      }, {
        "date": "2012-10-17",
        "value": 44
      }, {
        "date": "2012-10-18",
        "value": 49
      }, {
        "date": "2012-10-19",
        "value": 53
      }, {
        "date": "2012-10-20",
        "value": 57
      }, {
        "date": "2012-10-21",
        "value": 60
      }, {
        "date": "2012-10-22",
        "value": 61
      }, {
        "date": "2012-10-23",
        "value": 69
      }, {
        "date": "2012-10-24",
        "value": 67
      }, {
        "date": "2012-10-25",
        "value": 72
      }, {
        "date": "2012-10-26",
        "value": 77
      }, {
        "date": "2012-10-27",
        "value": 75
      }, {
        "date": "2012-10-28",
        "value": 70
      }, {
        "date": "2012-10-29",
        "value": 72
      }, {
        "date": "2012-10-30",
        "value": 70
      }, {
        "date": "2012-10-31",
        "value": 72
      }, {
        "date": "2012-11-01",
        "value": 73
      }, {
        "date": "2012-11-02",
        "value": 67
      }, {
        "date": "2012-11-03",
        "value": 68
      }, {
        "date": "2012-11-04",
        "value": 65
      }, {
        "date": "2012-11-05",
        "value": 71
      }, {
        "date": "2012-11-06",
        "value": 75
      }, {
        "date": "2012-11-07",
        "value": 74
      }, {
        "date": "2012-11-08",
        "value": 71
      }, {
        "date": "2012-11-09",
        "value": 76
      }, {
        "date": "2012-11-10",
        "value": 77
      }, {
        "date": "2012-11-11",
        "value": 81
      }, {
        "date": "2012-11-12",
        "value": 83
      }, {
        "date": "2012-11-13",
        "value": 80
      }, {
        "date": "2012-11-14",
        "value": 81
      }, {
        "date": "2012-11-15",
        "value": 87
      }, {
        "date": "2012-11-16",
        "value": 82
      }, {
        "date": "2012-11-17",
        "value": 86
      }, {
        "date": "2012-11-18",
        "value": 80
      }, {
        "date": "2012-11-19",
        "value": 87
      }, {
        "date": "2012-11-20",
        "value": 83
      }, {
        "date": "2012-11-21",
        "value": 85
      }, {
        "date": "2012-11-22",
        "value": 84
      }, {
        "date": "2012-11-23",
        "value": 82
      }, {
        "date": "2012-11-24",
        "value": 73
      }, {
        "date": "2012-11-25",
        "value": 71
      }, {
        "date": "2012-11-26",
        "value": 75
      }, {
        "date": "2012-11-27",
        "value": 79
      }, {
        "date": "2012-11-28",
        "value": 70
      }, {
        "date": "2012-11-29",
        "value": 73
      }, {
        "date": "2012-11-30",
        "value": 61
      }, {
        "date": "2012-12-01",
        "value": 62
      }, {
        "date": "2012-12-02",
        "value": 66
      }, {
        "date": "2012-12-03",
        "value": 65
      }, {
        "date": "2012-12-04",
        "value": 73
      }, {
        "date": "2012-12-05",
        "value": 79
      }, {
        "date": "2012-12-06",
        "value": 78
      }, {
        "date": "2012-12-07",
        "value": 78
      }, {
        "date": "2012-12-08",
        "value": 78
      }, {
        "date": "2012-12-09",
        "value": 74
      }, {
        "date": "2012-12-10",
        "value": 73
      }, {
        "date": "2012-12-11",
        "value": 75
      }, {
        "date": "2012-12-12",
        "value": 70
      }, {
        "date": "2012-12-13",
        "value": 77
      }, {
        "date": "2012-12-14",
        "value": 67
      }, {
        "date": "2012-12-15",
        "value": 62
      }, {
        "date": "2012-12-16",
        "value": 64
      }, {
        "date": "2012-12-17",
        "value": 61
      }, {
        "date": "2012-12-18",
        "value": 59
      }, {
        "date": "2012-12-19",
        "value": 53
      }, {
        "date": "2012-12-20",
        "value": 54
      }, {
        "date": "2012-12-21",
        "value": 56
      }, {
        "date": "2012-12-22",
        "value": 59
      }, {
        "date": "2012-12-23",
        "value": 58
      }, {
        "date": "2012-12-24",
        "value": 55
      }, {
        "date": "2012-12-25",
        "value": 52
      }, {
        "date": "2012-12-26",
        "value": 54
      }, {
        "date": "2012-12-27",
        "value": 50
      }, {
        "date": "2012-12-28",
        "value": 50
      }, {
        "date": "2012-12-29",
        "value": 51
      }, {
        "date": "2012-12-30",
        "value": 52
      }, {
        "date": "2012-12-31",
        "value": 58
      }, {
        "date": "2013-01-01",
        "value": 60
      }, {
        "date": "2013-01-02",
        "value": 67
      }, {
        "date": "2013-01-03",
        "value": 64
      }, {
        "date": "2013-01-04",
        "value": 66
      }, {
        "date": "2013-01-05",
        "value": 60
      }, {
        "date": "2013-01-06",
        "value": 63
      }, {
        "date": "2013-01-07",
        "value": 61
      }, {
        "date": "2013-01-08",
        "value": 60
      }, {
        "date": "2013-01-09",
        "value": 65
      }, {
        "date": "2013-01-10",
        "value": 75
      }, {
        "date": "2013-01-11",
        "value": 77
      }, {
        "date": "2013-01-12",
        "value": 78
      }, {
        "date": "2013-01-13",
        "value": 70
      }, {
        "date": "2013-01-14",
        "value": 70
      }, {
        "date": "2013-01-15",
        "value": 73
      }, {
        "date": "2013-01-16",
        "value": 71
      }, {
        "date": "2013-01-17",
        "value": 74
      }, {
        "date": "2013-01-18",
        "value": 78
      }, {
        "date": "2013-01-19",
        "value": 85
      }, {
        "date": "2013-01-20",
        "value": 82
      }, {
        "date": "2013-01-21",
        "value": 83
      }, {
        "date": "2013-01-22",
        "value": 88
      }, {
        "date": "2013-01-23",
        "value": 85
      }, {
        "date": "2013-01-24",
        "value": 85
      }, {
        "date": "2013-01-25",
        "value": 80
      }, {
        "date": "2013-01-26",
        "value": 87
      }, {
        "date": "2013-01-27",
        "value": 84
      }, {
        "date": "2013-01-28",
        "value": 83
      }, {
        "date": "2013-01-29",
        "value": 84
      }, {
        "date": "2013-01-30",
        "value": 81
      }
    ];

    // Set input format for the dates
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // Create series
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.tooltipText = "{value}"
    series.strokeWidth = 2;
    series.minBulletDistance = 15;

    // Drop-shaped tooltips
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.strokeOpacity = 0;
    series.tooltip.pointerOrientation = "vertical";
    series.tooltip.label.minWidth = 40;
    series.tooltip.label.minHeight = 40;
    series.tooltip.label.textAlign = "middle";
    series.tooltip.label.textValign = "middle";

    // Make bullets grow on hover
    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    bullet.circle.fill = am4core.color("#fff");

    var bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;

    // Make a panning cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panXY";
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    // Create vertical scrollbar and place it before the value axis
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    (<am4charts.XYChartScrollbar>chart.scrollbarX).series.push(series);
    chart.scrollbarX.parent = chart.bottomAxesContainer;
    dateAxis.start = 0.79;
    dateAxis.keepSelection = true;
  }

  private buildObligorChartDumbells(state: TradeObligorGraphPanelState, category: ObligorChartCategoryBlock, amChartsData: any[]): am4charts.ColumnSeries {

    if (amChartsData.length > 0) {
      // Create the column representing the mark discrepency.
      let dumbBellseries = state.obligorChart.series.push(new am4charts.ColumnSeries());
      dumbBellseries.data = amChartsData;
      dumbBellseries.dataFields.valueX = "workoutTerm";
      dumbBellseries.dataFields.openValueY = "mid";
      dumbBellseries.fill = am4core.color(category.data.color);
      dumbBellseries.stroke = am4core.color(category.data.color);
      dumbBellseries.name = category.data.name;
      dumbBellseries.strokeOpacity = 1;
      dumbBellseries.hidden = category.state.isHidden;
      dumbBellseries.sequencedInterpolation = true;
      dumbBellseries.columns.template.width = 3;
      dumbBellseries.dataFields.value = "markQuantity";
      dumbBellseries.hiddenState.transitionDuration = 0;
      dumbBellseries.defaultState.transitionDuration = 0;
      if (category.state.isMarkHidden) {
        dumbBellseries.dataFields.value = null;
        dumbBellseries.dataFields.valueY = "mid";
      }
      else dumbBellseries.dataFields.valueY = "mark";

      if (category.state.isMarkHidden === false) {
        // Modify the column color based on mark discrepency.
        let columnTemplate = dumbBellseries.columns.template;
        columnTemplate.strokeWidth = 1;
        columnTemplate.strokeOpacity = 1;
        columnTemplate.stroke = am4core.color(category.data.color);
        columnTemplate.hiddenState.transitionDuration = 0;
        columnTemplate.defaultState.transitionDuration = 0;
        let markDot = dumbBellseries.bullets.push(new am4charts.CircleBullet());
        markDot.circle.radius = 3;

        //Add a circle bullet to represent the mark.
        let markBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
        markBullet.circle.fillOpacity = 0.3;
        markBullet.circle.strokeOpacity = 1;
        markBullet.strokeOpacity = 1;
        markBullet.nonScalingStroke = true;
        // In order to build the correct toolip we will need to dig into the data to find if the markValue is null.
        markBullet.tooltipHTML = '';
        markBullet.adapter.add('tooltipHTML', function (text, target) {
          let data: any = target.tooltipDataItem.dataContext
          if (state.markValue.cS01) {
            return `<center><b>{name}</b> </br>
                  Mid: {mid} </br>
                  Mark: {mark}</br>
                  CS01: {markQuantity}</center>`;
          }
          else if (state.markValue.quantity) {
            return `<center><b>{name}</b> </br>
                  Mid: {mid} </br>
                  Mark: {mark}</br>
                  Current Position: {markQuantity}</center>`;
          }
        });
        markBullet.hiddenState.transitionDuration = 0;
        markBullet.defaultState.transitionDuration = 0;
        dumbBellseries.heatRules.push({
          target: markBullet.circle,
          min: 20,
          max: 30,
          property: "radius",
        });
      }

      // Add a circle bullet to represent the mid.
      let midBullet = dumbBellseries.bullets.push(new am4charts.CircleBullet());
      midBullet.circle.strokeOpacity = 1;
      midBullet.strokeOpacity = 1;
      midBullet.stroke = am4core.color(category.data.color).lighten(-0.3);
      midBullet.fill = am4core.color(category.data.color);
      midBullet.locationY = 1;
      midBullet.circle.radius = 5;
      midBullet.tooltipHTML = '';
      midBullet.hiddenState.transitionDuration = 0;
      midBullet.defaultState.transitionDuration = 0;

      // In order to build the correct toolip we will need to dig into the data to find if the markValue is null.
      midBullet.adapter.add('tooltipHTML', function (text, target) {
        let data: any = target.tooltipDataItem.dataContext;

        if (state.metric.yield || data.markQuantity === null) {
          return `<center><b>{name}</b> </br>
                  Mid: {mid}</center>`;
        }
        else if (state.markValue.cS01) {
          return `<center><b>{name}</b> </br>
                  Mid: {mid} </br>
                  Mark: {mark}</br>
                  CS01: {markQuantity}</center>`;
        }
        else if (state.markValue.quantity) {
          return `<center><b>{name}</b> </br>
                  Mid: {mid} </br>
                  Mark: {mark}</br>
                  Current Position: {markQuantity}</center>`;
        }
      });

      dumbBellseries.events.on("hidden", function () {
        dumbBellseries.hide();
      });
      return dumbBellseries;
    }
    else return null;

  }


  private buildObligorChartTrendCurve(state: TradeObligorGraphPanelState, category: ObligorChartCategoryBlock, amChartsData: any[], dumbBellSeries: am4charts.ColumnSeries): am4charts.LineSeries {

    var sortedArray: any[] = amChartsData.sort((obj1, obj2) => {
      if (obj1.workoutTerm > obj2.workoutTerm) {
        return 1;
      }

      if (obj1.workoutTerm < obj2.workoutTerm) {
        return -1;
      }

      return 0;
    });

    let series = state.obligorChart.series.push(new am4charts.LineSeries());
    series.data = amChartsData;
    series.dataFields.valueX = "workoutTerm";
    series.dataFields.valueY = "mid";
    series.hidden = true;
    series.hiddenInLegend = true;

    let regression = series.plugins.push(new am4plugins_regression.Regression());
    regression.method = "polynomial";
    regression.reorder = true;
    regression.options = {
      order: 2,
      precision: 10
    }

    let curveSeries: am4charts.LineSeries;
    regression.events.on("processed", (ev) => {

      let equation = ev.target.result.equation;

      if (this.validateCurveEquation(equation)) {

        let range: number;
        range = (amChartsData[amChartsData.length - 1].workoutTerm - amChartsData[0].workoutTerm) / 1000;

        let curve: any[] = [];
        for (let i = amChartsData[0].workoutTerm; i < amChartsData[amChartsData.length - 1].workoutTerm; i += range) {
          curve.push({ x: i, y: (equation[0] * (i * i) + (equation[1] * i) + equation[2]) });
        }

        curveSeries = state.obligorChart.series.push(new am4charts.LineSeries());
        curveSeries.data = curve;
        curveSeries.dataFields.valueX = "x";
        curveSeries.dataFields.valueY = "y";
        curveSeries.strokeWidth = 2;
        curveSeries.tensionY = 1;
        curveSeries.tensionX = 0.95;
        curveSeries.stroke = am4core.color(category.data.color);
        curveSeries.name = "CurveSeries";
        curveSeries.hiddenState.transitionDuration = 0;
        curveSeries.defaultState.transitionDuration = 0;
        curveSeries.hiddenInLegend = true;

        let regression = curveSeries.plugins.push(new am4plugins_regression.Regression());
        regression.method = "polynomial";
        regression.reorder = true;
        regression.options = {
          order: 2,
          precision: 10
        }

        // Hide the curve line when the coresponding dumbbell series is hidden.
        dumbBellSeries.events.on("hidden", function () {
          curveSeries.hide();
        });

        // Display the curve line when the coresponding dumbbell series is displayed.
        dumbBellSeries.events.on("shown", function () {
          curveSeries.show();
        });
      }
    });

    regression.dispose();

    return curveSeries;
  }

  private validateCurveEquation(curveResult: any[]) {
    let isValid: boolean;

    // Regression plugin can sometimes throw back "Infinity" if we only send two values.
    if (curveResult[0] === Number.POSITIVE_INFINITY || curveResult[1] === Number.POSITIVE_INFINITY || curveResult[2] === Number.POSITIVE_INFINITY ||
      curveResult[0] === Number.NEGATIVE_INFINITY || curveResult[1] === Number.NEGATIVE_INFINITY || curveResult[2] === Number.NEGATIVE_INFINITY) isValid = false;
    else isValid = true;

    return isValid;
  }

  private initializeObligorChartXAxis(state: TradeObligorGraphPanelState): am4charts.ValueAxis {
    let xAxis = state.obligorChart.xAxes.push(new am4charts.ValueAxis());
    xAxis.renderer.grid.template.strokeDasharray = "1,3";
    xAxis.title.text = "Tenor";
    xAxis.min = 0;
    xAxis.renderer.minGridDistance = 60;
    xAxis.extraMax = 0.05;

    return xAxis;
  }

  private initializeObligorChartYAxis(state: TradeObligorGraphPanelState): am4charts.ValueAxis {
    let yAxis = state.obligorChart.yAxes.push(new am4charts.ValueAxis());
    if (state.metric.spread) yAxis.title.text = "Spread";
    if (state.metric.yield) yAxis.title.text = "Yield";
    yAxis.renderer.grid.template.strokeDasharray = "1,3";
    yAxis.min = 0;
    yAxis.extraMax = 0.1;

    return yAxis;
  }

  private initializeObligorChartTriggerEvents(state: TradeObligorGraphPanelState, xAxis: am4charts.ValueAxis, yAxis: am4charts.ValueAxis) {
    // When the legend is clicked, reset the axis zoom scope.
    state.obligorChart.legend.events.on("hit", function (ev) {
      state.axesZoomState.xAxis.start = null;
      state.axesZoomState.xAxis.end = null;
      state.axesZoomState.yAxis.start = null;
      state.axesZoomState.yAxis.end = null;

      state.axesZoomState.xAxis.fullZoomStart = null;
      state.axesZoomState.xAxis.fullZoomEnd = null;
      state.axesZoomState.yAxis.fullZoomStart = null;
      state.axesZoomState.yAxis.fullZoomEnd = null;

    });

    // Capture the original zoom values of axes before a change is made.
    // TODO: Move this into their own method. ( I've attempted this a couple times, but passing / modifying the axes in a seperate method doesnt seem to work. )
    yAxis.events.on("startchanged", function (ev) {
      if (state.axesZoomState.yAxis.fullZoomStart === null && state.axesZoomState.yAxis.fullZoomEnd === null) {
        state.axesZoomState.yAxis.fullZoomStart = ev.target.minZoomed;
        state.axesZoomState.yAxis.fullZoomEnd = ev.target.maxZoomed;
      }

    });
    xAxis.events.on("startchanged", function (ev) {
      if (state.axesZoomState.xAxis.fullZoomStart === null && state.axesZoomState.xAxis.fullZoomEnd === null) {
        state.axesZoomState.xAxis.fullZoomStart = ev.target.minZoomed;
        state.axesZoomState.xAxis.fullZoomEnd = ev.target.maxZoomed;
      }
    });
    yAxis.events.on("endchanged", function (ev) {
      if (state.axesZoomState.yAxis.fullZoomStart === null && state.axesZoomState.yAxis.fullZoomEnd === null) {
        state.axesZoomState.yAxis.fullZoomStart = ev.target.minZoomed;
        state.axesZoomState.yAxis.fullZoomEnd = ev.target.maxZoomed;
      }
    });
    xAxis.events.on("endchanged", function (ev) {
      if (state.axesZoomState.xAxis.fullZoomStart === null && state.axesZoomState.xAxis.fullZoomEnd === null) {
        state.axesZoomState.xAxis.fullZoomStart = ev.target.minZoomed;
        state.axesZoomState.xAxis.fullZoomEnd = ev.target.maxZoomed;
      }
    });
  }

  private resetAxesZoomScope(state: TradeObligorGraphPanelState)
  {

  }
}