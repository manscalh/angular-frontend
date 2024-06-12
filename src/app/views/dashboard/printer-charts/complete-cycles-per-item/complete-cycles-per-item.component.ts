import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-complete-cycles-per-item',
  templateUrl: './complete-cycles-per-item.component.html',
  styleUrls: ['./complete-cycles-per-item.component.scss']
})
export class CompleteCyclesPerItemComponent implements OnInit {

  constructor(private service: ReportService) { }

  public objList = [];

  private createChartPie(cyclesPerTimeCounts): void {
    
    const categories = cyclesPerTimeCounts.map(item => item.name);
   
    const chart = Highcharts.chart('chart-cycles-per-time', {
      chart: {
        type: 'bar',
      },
      title: {
        text:  "Complete cycle by item",
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
          text: ''
        }
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ''
      },
      series: [{
        name: 'Complete cycle',
        data: cyclesPerTimeCounts,
        stack: 'male',
        color: '#83A7D5',
        innerSize: '50%'

      }],
    } as any);
  }

  private getAll() {

    this.service.getDadosReportObservable().subscribe((dados) => {

      const dataArray = Array.isArray(dados) ? dados : Object.values(dados);

      const filteredItens = dataArray.map((item) => item);      

        const itensCounsts = filteredItens.reduce((counts, item) => {
          const packageName = item.package_name;
          counts[packageName] = (counts[packageName] || 0) + 1;
          return counts;
        }, {});

        const itensChartData = Object.keys(itensCounsts).map((packageName) => {
          return {
            name: packageName,
            y: itensCounsts[packageName]
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
