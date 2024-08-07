import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-maximum-cycle',
  templateUrl: './maximum-cycle.component.html',
  styleUrls: ['./maximum-cycle.component.scss']
})
export class MaximumCycleComponent  implements OnInit {

  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  constructor(private service: ReportService) {}

  countValue: string = '0';
  chart: Highcharts.Chart; 

  chartOptions: Highcharts.Options = {
    chart: {},
    title: {
      text:  "Cycle average",
      margin: 32,
      align: 'center',
      style: {
        textAlign: 'center',
        fontFamily: 'HP Simplified',
        color: '#3DCBD1',
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
    this.chart = Highcharts.chart('chart-maximum-cycle', this.chartOptions);
  }

  private async getAll() {
    
    this.service.getDadosReportObservable().subscribe((dados) => {

      const dataArray = Array.isArray(dados) ? dados : Object.values(dados);
        
        let somaCicloCompleto = 0;
        const uniqueCodeSet = new Set(); // Usamos um Set para armazenar códigos únicos
  
        for (const key in dataArray) {
          if (dataArray.hasOwnProperty(key)) {
            const registro = dataArray[key];
  
            somaCicloCompleto += registro.ciclo_completo;
  
            // Adicione o código ao conjunto para garantir que ele seja único
            uniqueCodeSet.add(registro.code);
          }
        }

        const countCode = uniqueCodeSet.size; 
        this.countValue = (somaCicloCompleto / countCode).toFixed(1); 

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
