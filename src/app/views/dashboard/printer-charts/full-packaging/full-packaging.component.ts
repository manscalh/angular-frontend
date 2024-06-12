import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-full-packaging',
  templateUrl: './full-packaging.component.html',
  styleUrls: ['./full-packaging.component.scss']
})
export class FullPackagingComponent implements OnInit {
  @Input() filtroData: any;
  @Input() reportData: any;
  @Input() reportDataAll: any;

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  constructor(private service: ReportService) { }

  countValue: string = '0';
  chart: Highcharts.Chart; 

  chartOptions: Highcharts.Options = {
    chart: {},
    title: {
      text: 'Total packaging',
      margin: 32,
      align: 'center',
      style: {
        textAlign: 'center',
        fontFamily: 'HP Simplified',
        color: '#4E8EB5',
        fontSize: '22px',
      }
    },
    subtitle: {
      text: this.countValue,
      y: 100,
      style: {
        textAlign: 'center',
        fontFamily: 'HP Simplified bold',
        color: '#3E4347',
        fontSize: '50px',
      }
    },
    credits: {
      enabled: false
    },
    exporting: {
      allowHTML: true,
      menuItemDefinitions: {
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
        }
        }
      }
  };

  private createChart(): void {
    this.chart = Highcharts.chart('chart-full-packaging', this.chartOptions);
  }

  private async getAll() {

    this.service.getDadosReportAllObservable().subscribe((dados) => {

      const dataArray = Array.isArray(dados) ? dados : Object.values(dados);

       const codeCount: Record<string, number> = {};

      dataArray.forEach((item) => {
        const code = (item as any).code; 
        if (codeCount[code]) {
          codeCount[code]++;
        } else {
          codeCount[code] = 1;
        }
      });

      this.countValue = Object.values(codeCount).length.toString()
     
      this.chart.setSubtitle({ text: this.countValue });

      this.updateFlag = true;

    });

    this.createChart();
  }
  
  ngOnInit(): void {
    this.getAll();

  }
}
