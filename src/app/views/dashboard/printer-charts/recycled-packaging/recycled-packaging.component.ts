import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-recycled-packaging',
  templateUrl: './recycled-packaging.component.html',
  styleUrls: ['./recycled-packaging.component.scss']
})
export class RecycledPackagingComponent implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  constructor(private service: ReportService) {}

  countValue: string = '0';
  chart: Highcharts.Chart; 

  chartOptions: Highcharts.Options = {
    chart: {},
    title: {
      text:  "Recycled packaging",
      margin: 32,
      align: 'center',
      style: {
        textAlign: 'center',
        fontFamily: 'HP Simplified',
        color: '#84D03F',
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
    this.chart = Highcharts.chart('chart-recycled-packaging', this.chartOptions);
  }

  private async getAll() {

    this.service.getDadosReportAllObservable().subscribe((dados) => {

      const dataArray = Array.isArray(dados) ? dados : Object.values(dados);
    
        // Filtrar os registros onde station_name é igual a "Central de Resíduos"
        const centralDeResiduosRecords = dataArray.filter(
          (registro: any) => registro.station_name == "FLEX CENTRAL DE RESIDUOS"
        );
  
        // Usar um Set para manter apenas valores únicos de 'code'
        const uniqueCodes = new Set<string>();
  
        centralDeResiduosRecords.forEach((registro: any) => {
          uniqueCodes.add(registro.code);
        });
  
        // Obter o número de registros únicos
        const uniqueCodeCount = uniqueCodes.size;
  
        // Atualizar a contagem
        this.countValue = uniqueCodeCount.toString();
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
