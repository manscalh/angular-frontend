import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReportService } from 'src/app/core/services/report.service';

@Component({
  selector: 'app-printer',
  templateUrl: './printer.component.html',
  styleUrls: ['./printer.component.scss']
})
export class PrinterComponent implements OnInit {

  @Output() dadosFiltrados: EventEmitter<any> = new EventEmitter<any>(); 
  @Output() dadosReport: EventEmitter<any> = new EventEmitter<any>(); 

  filtroForm: FormGroup;
  public isVisibleCard: boolean = true;
  public isLoading = true;
  public packageOptions: string[] = []

  constructor(private service: ReportService) {

    this.filtroForm = new FormGroup({
      package_name: new FormControl(''),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
    });
    

  }

  logData() {
    const dadosFiltrados = this.filtroForm.value;
  
    this.isLoading = true;

    this.service.getAllByFilter(dadosFiltrados).subscribe(
      (res) => {
        this.service.setDadosReport(res)
      }
    );

    this.service.getAllHistoryByFilter(dadosFiltrados).subscribe(
      (res) => {
        this.service.setDadosReportAll(res)
        this.isLoading = false;
      }
    );
      
  }
  
  private async getAll() {
    
    this.service.getAll().subscribe(
      (res) => {
        
        this.service.setDadosReport(res)
    
      }
    );

    this.service.getAllHistory().subscribe(
      (res) => {
        
        this.service.setDadosReportAll(res)
    
      }
    );
    
  }

  carregarOpcoesDoBanco() {

    this.service.getDadosReportObservable().subscribe((dados) => {
      const dataArray = Array.isArray(dados) ? dados : Object.values(dados);
      
      const uniquePackageNames = Array.from(new Set(dataArray.map(item => item.package_name)));
      
      this.packageOptions = uniquePackageNames;
    });
  }

  ngOnInit(): void {
    this.getAll();
    this.carregarOpcoesDoBanco();
    setTimeout(() => {
      this.isLoading = false;
    }, 4000)
  }

  opened() {
    this.isVisibleCard = !this.isVisibleCard
  }

}
