import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { UserService } from 'src/app/core/services/user.service';
import { CodeService } from 'src/app/core/services/code.service';
import { CodeHistoryService } from 'src/app/core/services/code-history.service';
import { ReportService } from 'src/app/core/services/report.service';
@Component({
  selector: 'app-scan-history-table',
  templateUrl: './scan-history-table.component.html',
  styleUrls: ['./scan-history-table.component.scss']
})

export class ScanHistoryTableComponent implements OnInit {

  public isVisibleCard: boolean = true;
  public isLoading = true;
  public submitted = false;
  public isLoadingSearch = false;
  public objList = [];

  public msg: string = "No data";
  modalRef?: BsModalRef;

  public formObject = new FormGroup({
    stationId: new FormControl(''),
    userId: new FormControl(''),
    scan: new FormControl('',
    [
    Validators.required,
    Validators.minLength(2),
    Validators.maxLength(100),
    ])
});

  constructor(
    private service: ReportService
 
    ) { }   

  ngOnInit(): void {
    this.getAll();
  }

  private getAll() {
    this.isLoadingSearch = true;
    this.service.getDadosReportAllObservable().subscribe(
      (dados) => {

        const dataArray = Array.isArray(dados) ? dados : Object.values(dados);

        dataArray.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        this.objList = dados.slice(0, 15);
        this.isLoading = true;
        this.isLoadingSearch = false;
      },
      (err) => {
        console.error('Observer got an error: ' + err);
        this.isLoading = false;
        this.isLoadingSearch = false;
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  public onPageChange($event: any) {
    this.pageChange.emit($event);
  }

  search(event: any) { }

  changed(value: string) { }
}
