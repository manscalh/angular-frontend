import { Component, Input, OnInit, Testability } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { DrilldownOptions, Options, LegendOptions, PaneOptions, PaneBackgroundOptions, PlotOptions, SeriesOptionsType, SubtitleOptions, TitleOptions, TooltipOptions, XAxisOptions, YAxisOptions } from 'highcharts';

@Component({
  selector: 'app-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {

  @Input() title!: TitleOptions | undefined;
  @Input() options!: Options | undefined;
  @Input() subtitle!: SubtitleOptions;
  @Input() xAxisOptions!: XAxisOptions | XAxisOptions[];
  @Input() yAxisOptions!: YAxisOptions | YAxisOptions[];
  @Input() tooltipOptions!: TooltipOptions | undefined;
  @Input() plotOptions!: PlotOptions | undefined;
  @Input() paneOptions!: PaneOptions | undefined;
  @Input() paneBackgroundOptions!: PaneBackgroundOptions | undefined;
  @Input() legendOptions: LegendOptions | undefined = {};
  @Input() series!: SeriesOptionsType[];
  @Input() isLoading: boolean = false;
  @Input() redirectDetails!: Function;
  @Input() isVisibleTitle: boolean = false;
  @Input() updateFlag: boolean = false;
  @Input() drilldownOptions: DrilldownOptions | undefined = {};

  chart!: Chart;

  constructor(public router: Router) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.createChartColumn()
    }, 0)

  }

  createChartColumn() {

    this.chart = new Chart({

      chart: {
        events: {
          drilldown: () => {
            //console.log("Set drildown");
            this.chart.ref.setSubtitle({ text: 'MONTHS' });
          },
          drillup: () => {
            this.chart.ref.setSubtitle({ text: 'ANNUAL' });
          }
        },
        // style: {
        //   fontFamily: 'Arial'
        // }
      },
      title: this.title,
      subtitle: this.subtitle,
      pane: this.paneOptions,    
      credits: {
        enabled: false
      },
      exporting: {
        allowHTML: true,
        // chartOptions: {
        //   chart: {
        //     style: {
        //       fontFamily: 'Arial'
        //     }
        //   }
        // },
        menuItemDefinitions: {
          // Custom definition
          label: {
            onclick: function () {
              this.renderer.label(
                'You just clicked a custom menu item',
                100,
                100
              )
                .attr({
                  fill: '#a4edba',
                  r: 5,
                  padding: 10,
                  zIndex: 10
                })
                .css({
                  fontSize: '1.5em'
                })
                .add();
            },
            text: 'Show label'
          }
        },
        buttons: {
          contextButton: {
            menuItems: ['viewFullscreen', 'printChart', 'separator', 'downloadJPEG', 'downloadPNG', 'downloadPDF']
          },
          customButton: {
            enabled: this.redirectDetails != null,
            symbol: 'text:\ue976',

            onclick: () => {
              this.redirectDetails()
            },
            theme: {
              fill: '#FFF',
              stroke: "#FFF"

            }
          }
        }
      },
      xAxis: this.xAxisOptions,
      yAxis: this.yAxisOptions,
      tooltip: this.tooltipOptions == undefined ? {} : this.tooltipOptions,
      plotOptions: this.plotOptions == undefined ? {} : this.plotOptions,
      legend: this.legendOptions,
      series: this.series,
      drilldown: this.drilldownOptions
    });

  }

}
