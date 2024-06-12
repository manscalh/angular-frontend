import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-packaging-location',
  templateUrl: './packaging-location.component.html',
  styleUrls: ['./packaging-location.component.scss']
})
export class PackagingLocationComponent implements OnInit {

  constructor(private service: ReportService) { }

  public objList = [];

  private createChartPie(stationCounts): void {
    const chart = Highcharts.chart('chart-pkg-location', {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Quantity by location',
        margin: 32,
        align: 'center',
        style: {
          textAlign: 'center',
          fontFamily: 'HP Simplified',
          color: '#3DCBD1',
          fontSize: '22px',
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        headerFormat: `<span class="mb-2">Location: {point.key}</span><br>`,
        pointFormat: '<span>Quantity: {point.y}</span>',
        useHTML: true,
      },
      series: [{
        name: null,
        innerSize: '50%',
        data: stationCounts,
      }],
    } as any);
  }

  private getAll() {
    
    this.service.getDadosReportAllObservable().subscribe((dados) => {

      const dataArray = Array.isArray(dados) ? dados : Object.values(dados);
  
        const oldestItems = {};
  
        dataArray.forEach((item) => {
          const stationName = item.station_name;
          const createdAt = new Date(item.created_at).getTime(); 
  
          if (!oldestItems[stationName] || createdAt < oldestItems[stationName].createdAt) {
            oldestItems[stationName] = {
              name: stationName,
              y: 1,
              createdAt, 
            };
          } else {
            oldestItems[stationName].y++; // Incrementa a contagem
          }
        });
  
        const itensChartData = Object.values(oldestItems);
  
        this.createChartPie(itensChartData);
      },
      (err) => {
        console.error('Observer got an error: ' + err);
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    );
  }
  
  ngOnInit(): void {
    this.createChartPie([])
    this.getAll();
  }
}
