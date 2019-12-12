import { Component, ViewEncapsulation, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_regression from "@amcharts/amcharts4/plugins/regression";
import { TradeCenterPanel } from './trade-center-panel.container';
import { CoreModule } from 'App/modules/core/core.module';

am4core.useTheme(am4themes_animated);


@Component({
  selector: 'trade-obligor-graph-panel',
  templateUrl: './trade-obligor-graph-panel.container.html',
  styleUrls: ['./trade-obligor-graph-panel.container.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class TradeObligorGraphPanel {
  private chart: am4charts.XYChart;
  private sampleData = [];

  constructor(private zone: NgZone) {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.chart = am4core.create("chartdiv", am4charts.XYChart);

      this.populateSampleData();

      let srBondData = [];
      let srCDSData = [];
      let subBondData = [];
      let subCDS = [];

      for (let sample of this.sampleData) {
        if (sample.seniority === "Sr Bond") {
          srBondData.push({ seniority: sample.seniority, category: sample.category, mid: sample.mid, mark: sample.mark, security: sample.security, securityCount: sample.securityCount });
        }
        if (sample.seniority === "Sr CDS") {
          srCDSData.push({ seniority: sample.seniority, category: sample.category, mid: sample.mid, mark: sample.mark, security: sample.security, securityCount: sample.securityCount });
        }
        if (sample.seniority === "Sub Bond") {
          subBondData.push({ seniority: sample.seniority, category: sample.category, mid: sample.mid, mark: sample.mark, security: sample.security, securityCount: sample.securityCount });
        }
        if (sample.seniority === "Sub CDS") {
          subCDS.push({ seniority: sample.seniority, category: sample.category, mid: sample.mid, mark: sample.mark, security: sample.security, securityCount: sample.securityCount });
        }
      }

      this.initializeAxis(srBondData);
      this.createGraph(srBondData, "#712f79");

      this.initializeAxis(srBondData);
      this.createGraph(srCDSData, "#293881");

      this.initializeAxis(srBondData);
      this.createGraph(subBondData, "#0f8276");

      this.initializeAxis(srBondData);
      this.createGraph(subCDS, "#ff9933");

      this.chart.cursor = new am4charts.XYCursor();
      this.chart.legend = new am4charts.Legend();
      this.chart.legend.markers.template.disabled = true;


      this.chart.seriesContainer.draggable = false;
      this.chart.seriesContainer.resizable = false;

    });
  }

  createGraph(data: any, color: string) {

    let series = this.chart.series.push(new am4charts.ColumnSeries());
    series.data = data;
    series.dataFields.categoryX = "category";
    series.dataFields.openValueY = "mid";
    series.dataFields.valueY = "mark";
    series.tooltipText = " {security} | mid: {openValueY.value} mark: {valueY.value}";
    series.sequencedInterpolation = true;
    series.strokeOpacity = 1;
    series.columns.template.width = 3;
    series.tooltip.pointerOrientation = "horizontal";
    series.dataFields.value = "securityCount";
    series.name = data[0].seniority;
    series.fill = am4core.color(color);
    series.stroke = am4core.color(color);
    series.legendSettings.labelText = "[bold {color}]{name}[/]";

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color(color);

    columnTemplate.adapter.add("fill", function (fill, target) {
      let index: number = target.dataItem.index;

      if (series.data[index].mid > series.data[index].mark) {
        return am4core.color("#cc3300");
      }
    })

    columnTemplate.adapter.add("stroke", function (stroke, target) {
      let index: number = target.dataItem.index;

      if (series.data[index].mid > series.data[index].mark) {
        return am4core.color("#cc3300");
      }
    })

    let curveData = [];
    for (var i = 0; i < data.length; i++) {
      curveData.push({ x: data[i].category, y: data[i].mark });
    }
    //add the trendlines
    let trend = this.chart.series.push(new am4charts.LineSeries());
    trend.dataFields.categoryX = "x";
    trend.dataFields.valueY = "y";
    trend.strokeWidth = 2
    trend.stroke = am4core.color(color);
    trend.strokeOpacity = 0.7;
    trend.hiddenInLegend = true;
    trend.data = curveData;
    trend.tensionY = 1;
    trend.tensionX = 1;

    var reg2 = trend.plugins.push(new am4plugins_regression.Regression());
    reg2.method = "polynomial";

    // Add simple bullet
    let midBullet = series.bullets.push(new am4charts.CircleBullet());
    midBullet.fill = am4core.color(color);
    midBullet.locationY = 1;

    var bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.fill = am4core.color(color);
    bullet.circle.fillOpacity = 0.5;
    bullet.circle.stroke = am4core.color(color);
    bullet.circle.strokeOpacity = 0.5;
    bullet.strokeOpacity = 5;
    bullet.fillOpacity = 10;
    bullet.nonScalingStroke = true;
    series.heatRules.push({
      target: bullet.circle,
      min: 5,
      max: 20,
      property: "radius",
    });

    series.events.on("hidden", function () {
      series.hide();
      trend.hide();
    });

    series.events.on("shown", function () {
      series.show();
      trend.show();
    });

  }

  initializeAxis(data: any) {
    let tenorAxis = this.chart.xAxes.push(new am4charts.CategoryAxis());
    tenorAxis.renderer.grid.template.location = 0;
    tenorAxis.dataFields.category = "category";
    tenorAxis.renderer.minGridDistance = 15;
    tenorAxis.renderer.grid.template.location = 0.5;
    tenorAxis.renderer.grid.template.strokeDasharray = "1,3";
    tenorAxis.renderer.labels.template.rotation = -90;
    tenorAxis.renderer.labels.template.horizontalCenter = "left";
    tenorAxis.renderer.labels.template.location = 0.5;
    tenorAxis.renderer.inside = true;
    tenorAxis.data = data;

    tenorAxis.renderer.labels.template.adapter.add("dx", function (dx, target) {
      return -target.maxRight / 2;
    })

    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.ticks.template.disabled = true;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.data = data;
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  populateSampleData() {
    this.sampleData.push({ category: "1Y", mid: 100.5, mark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "2Y", mid: 100, mark: 100, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "3Y", mid: 105, mark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "4Y", mid: 101, mark: 101, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "5Y", mid: 102, mark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "6Y", mid: 106, mark: 104, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "7Y", mid: 100, mark: 100, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sr Bond" });
    this.sampleData.push({ category: "8Y", mid: 110, mark: 110, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "9Y", mid: 102, mark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sr Bond" });
    this.sampleData.push({ category: "10Y", mid: 108, mark: 108, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sr Bond" });

    this.sampleData.push({ category: "1Y", mid: 104, mark: 104, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "2Y", mid: 100, mark: 100, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "3Y", mid: 105, mark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "4Y", mid: 102, mark: 102, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "5Y", mid: 102, mark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "6Y", mid: 106, mark: 104, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "7Y", mid: 110, mark: 110, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sr CDS" });
    this.sampleData.push({ category: "8Y", mid: 110, mark: 110, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "9Y", mid: 103, mark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sr CDS" });
    this.sampleData.push({ category: "10Y", mid: 114, mark: 114, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sr CDS" });

    this.sampleData.push({ category: "1Y", mid: 100.5, mark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "2Y", mid: 101, mark: 101, security: "CHIWIN 7.9 01/23/21", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "3Y", mid: 105.6, mark: 105, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "4Y", mid: 101, mark: 101, security: "CMZB 5 ½ 08/29/28", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "5Y", mid: 102, mark: 102, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "6Y", mid: 106, mark: 104.5, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "7Y", mid: 100, mark: 100, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sub Bond" });
    this.sampleData.push({ category: "8Y", mid: 109.2, mark: 109.2, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "9Y", mid: 104.6, mark: 105, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sub Bond" });
    this.sampleData.push({ category: "10Y", mid: 99, mark: 99, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sub Bond" });

    this.sampleData.push({ category: "1Y", mid: 100.5, mark: 100.5, security: "ZHPRHK 9.15 03/08/22", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "3Y", mid: 102.6, mark: 102.6, security: "SUNAU 1.85 07/30/24", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "5Y", mid: 103, mark: 103, security: "FBAVP 3.4 03/12/20", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "6Y", mid: 103.45, mark: 100, security: "NESNVX 3 ⅝ 11/03/20", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "7Y", mid: 106, mark: 101, security: "WFC 5 ¼ 09/07/22", securityCount: 2, seniority: "Sub CDS" });
    this.sampleData.push({ category: "8Y", mid: 108, mark: 108, security: "CSCHCN 10 ⅞ 08/24/20", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "9Y", mid: 100, mark: 103, security: "EVERRE 8.9 05/24/21", securityCount: 1, seniority: "Sub CDS" });
    this.sampleData.push({ category: "10Y", mid: 99.78, mark: 99.78, security: "MITSRE 2.95 01/23/23", securityCount: 1, seniority: "Sub CDS" });
  }

}