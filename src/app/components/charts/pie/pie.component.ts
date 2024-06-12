import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {

  chart!: Chart;

  constructor() { }

  ngOnInit(): void {
    this.createChartPie()
  }

  createChartPie() {
    this.chart = new Chart({
      chart: {
        // plotBackgroundColor: null,
        // plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: "ACCESS RATE",
        margin: 32,
        align: 'left',
        style: {
          textAlign: 'center',
          fontFamily: 'HP Simplified',
          color: '#000000',
          fontSize: '22px',
        }
      },
      subtitle: {
        text: 'ANNUAL',
        y: 48,
        style: {
          textAlign: 'center',
          fontFamily: 'HP Simplified Italic',
          color: '#5B5959',
          fontSize: '12px'
        }
      },
      // tooltip: {
      //   pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      // },
      credits: {
        enabled: false
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',

        }
      },
      series: [{
        type: 'pie',
        name: 'Brands',
        colorByPoint: true,
        data: [
          {
            name: "Firefox",
            y: 45765,
            drilldown: "Firefox",
            dataLabels: {
              enabled: true,
              format: '{y}',
              distance: -50,
              style: {
                fontSize: '18px'
              }

            }
          },
          {
            name: "Chrome",
            y: 72212,
            drilldown: "Chrome",
            dataLabels: {
              enabled: true,
              format: '{y}',
              distance: -50,
              style: {
                fontSize: '18px'
              }

            }
          },

        ]
      }]
    })
  }

}
