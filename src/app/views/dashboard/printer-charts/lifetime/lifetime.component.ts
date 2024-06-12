import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-lifetime',
  templateUrl: './lifetime.component.html',
  styleUrls: ['./lifetime.component.scss']
})
export class LifetimeComponent  implements OnInit {

  constructor(private service: ReportService) { }

  public objList = [];

  private createChartPie(cycleMaxCounts): void {
    const chart = Highcharts.chart('chart-lifetime', {
      chart: {
        type: 'solidgauge',
      },
      title: {
        text:  "Reuse limit",
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
        text:  "AVG (DAYS) | TARGET (AVG) ",
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
      xAxis: {},
      yAxis: {
        allowDecimals: true,
        min: 0,
        max: 100,
        stops: [
          [0.29, '#EF978E'], // red
          [0.3, '#83A7D5'], // green
          // [0.5, '#DDDF0D'], // yellow
          
        ],
        minorTickInterval: null,
        tickAmount: 2,
        labels: {
          y: 16,
        }
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        valueSuffix: ' dias'
      },
      series: [{
        name: 'Tempo máximo de vida',
        innerSize: '50%',
        data: [parseFloat(cycleMaxCounts)],
      }],
    } as any);
  }

    private getAll() {
      
      this.service.getDadosReportObservable().subscribe((dados) => {

        const dataArray = Array.isArray(dados) ? dados : Object.values(dados);
    
          function calcularDiferencaDias(dataInicio: string, dataFim: string): number {
            const inicio = new Date(dataInicio);
            const fim = new Date(dataFim);
    
            if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
              return NaN;
            }
    
            const diffEmMs = fim.getTime() - inicio.getTime();
            return diffEmMs / (1000 * 60 * 60 * 24);
          }
    
          const groupedData = dataArray.reduce((groups, item) => {
            const packageName = item.package_name;
            if (!groups[packageName]) {
              groups[packageName] = [];
            }
            groups[packageName].push(item);
            return groups;
          }, {});

          const result = {};

    
          for (const packageName in groupedData) {
            const group = groupedData[packageName];
            
            if (group.length >= 2) { 
              const firstItem = group[0];
              const lastItem = group[group.length - 1];
              
              const diffDias = calcularDiferencaDias(firstItem.created_at, lastItem.created_at);
              result[packageName] = diffDias;
            }
          }

    
          let somaTotal = 0;
          for (const packageName in result) {
            somaTotal += result[packageName];
          }
          
          const total = somaTotal.toFixed(1);
        
          this.createChartPie(total);
        },
        (err) => {
          console.error('Observer got an error: ' + err);
        },
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 0));
        }
      );
    }
    

  ngOnInit(): void {
    this.createChartPie([])
    this.getAll();
  }

}
