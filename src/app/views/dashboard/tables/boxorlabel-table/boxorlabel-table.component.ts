import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, PipeTransform } from '@angular/core';
import { IPrinterScan } from 'src/app/core/models/printerscan-model';
import { BoxorlabelTableServiceService } from 'src/app/core/services/boxorlabel-table-service.service';


@Component({
  selector: 'app-boxorlabel-table',
  templateUrl: './boxorlabel-table.component.html',
  styleUrls: ['./boxorlabel-table.component.scss']
})
export class BoxorlabelTableComponent implements OnInit {

  isLoading = false;
  data: IPrinterScan[] = [];
  dataFiltered: IPrinterScan[] = [];
  @Input() page = 1;
   offset = 10;
   total = 0;

  constructor(private tablesevice: BoxorlabelTableServiceService) { }

  ngOnInit(): void {
    this.tablesevice.getData().subscribe(data => {
      this.data = data;
      this.dataFiltered = this.data
      if(this.data.length > 0){
        this.isLoading = true
      }
    });
  }

  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  public onPageChange($event: any) {
    this.pageChange.emit($event);
  }

  search(event: any) {
    this.dataFiltered = this.data.filter(data => {
      const term = event.target.value.toLowerCase();
      return data.IP?.toLowerCase().includes(term)
        || data.CityScan?.toLowerCase().includes(term)
        || data.StateScan?.toLowerCase().includes(term)
        || data.Monthscan?.toLowerCase().includes(term)
        || data.ScanYear?.toString()?.toLowerCase().includes(term)
        || data.TypeProduct?.toLowerCase().includes(term)
        || data.BoxOrLabel?.toLowerCase().includes(term)
    });
  }

  changed(value: string) {
    this.offset = Number(value);
  }

}
