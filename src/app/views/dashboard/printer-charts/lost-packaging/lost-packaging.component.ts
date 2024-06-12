import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-lost-packaging',
  templateUrl: './lost-packaging.component.html',
  styleUrls: ['./lost-packaging.component.scss']
})
export class LostPackagingComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  constructor(private service: ReportService) {}

  countValue: string = '0';
  chart: Highcharts.Chart; 

  chartOptions: Highcharts.Options = {
    chart: {},
    title: {
      text:  "Lost packaging",
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
    this.chart = Highcharts.chart('chart-lost-packaging', this.chartOptions);
  }

  private async getAll() {

    this.service.getDadosReportAllObservable().subscribe((dados) => {

      const dataArray = Array.isArray(dados) ? dados : Object.values(dados);

          // Filtrar os registros onde station_name não é igual a "Central de Residuos"
          const filteredRecords = dataArray.filter(
            (registro: any) => registro.station_name !== "Central de Residuos"
          );

          const groupedRecords: { [key: string]: any[] } = {};

          filteredRecords.forEach((registro: any) => {
            if (!groupedRecords.hasOwnProperty(registro.code)) {
              groupedRecords[registro.code] = [];
            }
            groupedRecords[registro.code].push(registro);
          });

          // Filtrar grupos com uma diferença de 1 dia ou mais entre o primeiro e o último registro
          const filteredGroups = Object.values(groupedRecords).filter((group: any[]) => {
            if (group.length >= 2) {
              const firstRecordDate = new Date(group[0].created_at);
              const lastRecordDate = new Date(group[group.length - 1].created_at);
              const timeDifference = lastRecordDate.getTime() - firstRecordDate.getTime();
              const daysDifference = timeDifference / (1000 * 3600 * 24);
              return daysDifference >= 160;
            }
            return false;
          });
  
          // Contar os grupos únicos
          const uniqueGroupCount = filteredGroups.length;
  
          // Atualizar a contagem
          this.countValue = uniqueGroupCount.toString();
          this.chart.setSubtitle({ text: this.countValue });
          this.updateFlag = true;
       
      }
    );
  
    this.createChart();
  }
  

  ngOnInit(): void {
    this.getAll();
  }

 
}
