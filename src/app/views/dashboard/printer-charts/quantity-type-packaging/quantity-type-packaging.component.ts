import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-quantity-type-packaging',
  templateUrl: './quantity-type-packaging.component.html',
  styleUrls: ['./quantity-type-packaging.component.scss']
})
export class QuantityTypePackagingComponent implements OnInit {

  constructor(private service: ReportService ) { }

  public objList = [];

  private createChartPie(quantityTypePackagingCounts): void {

    const categories = quantityTypePackagingCounts.map(item => item.name);

    const chart = Highcharts.chart('chart-quantity-type-packaging', {
      chart: {
        type: 'column',
      },
      title: {
        text:  "Quantity by packaging type",
        margin: 32,
        align: 'center',
        style: {
          textAlign: 'center',
          fontFamily: 'HP Simplified',
          color: '#909096',
          fontSize: '22px',
        }
      }, 
      subtitle: {
        text:  "",
        y: 52,
        style: {
          textAlign: 'center',
          fontFamily: 'HP Simplified Italic',
          color: '#5B5959',
          fontSize: '14px'
        }
      },
      pane: {
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
        size: '120%',
        background: {
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'}
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: -30,
            borderWidth: 0,
            useHTML: true,
            style: {'fontSize': '22px'}
          },
        }
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        min: 0,
        title: {
        text: 'Type'
    }
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ''
      },
      series: [{
        name: 'PACKAGING',
        data: quantityTypePackagingCounts,
        stack: 'male',
        color: '#3DCBD1',
        innerSize: '50%'

      }],
    } as any);
  }

  private getAll() {

    this.service.getDadosReportObservable().subscribe((dados) => {

      const dataArray = Array.isArray(dados) ? dados : Object.values(dados);

        const filteredItens = dataArray.map((item) => item);      

        const itensCounsts = filteredItens.reduce((counts, item) => {
          const packageDescription = item.package_description;
          counts[packageDescription] = (counts[packageDescription] || 0) + 1;
          return counts;
        }, {});

        const itensChartData = Object.keys(itensCounsts).map((packageDescription) => {
          return {
            name: packageDescription,
            y: itensCounsts[packageDescription]
          };
        });

        this.createChartPie(itensChartData);
      },
      (err) => {
        console.error('Observer got an error: ' + err);
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

  }

  ngOnInit(): void {
    this.createChartPie([])
    this.getAll();
  }
  
}
