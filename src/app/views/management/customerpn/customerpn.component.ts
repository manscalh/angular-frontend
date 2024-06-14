
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PreserveSearchUserService } from 'src/app/core/filters/user.filter';
import { ICustomerPN } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomerPNService } from 'src/app/core/services/customerpn.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-customerpn',
  templateUrl: './customerpn.component.html',
  styleUrls: ['./customerpn.component.scss']
})
export class CustomerpnComponent implements OnInit {

  private url_crud: string = "/management/customerpn";
  public isVisibleCard: boolean = true;
  public isLoading = true;
  public isLoadingSearch = false;
  public objList = [];
  public formObject!: FormGroup;
  public msg: string = "No data";
  public customerpn: ICustomerPN;
  modalRef?: BsModalRef;
  private objDelete = 0;
  public p: number = 1;
  public currentPage: number = 1;
  public lastPage: number = 1;
  public perPage: number = 5;
  public total: number = 0;
  public pageSizes: Array<number> = [5,10,25,50];

  constructor(
    private authservice: AuthService,
    private router: Router,
    private service: CustomerPNService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private modalService: BsModalService,
    private preserveSearch: PreserveSearchUserService
    ) {}

  confirmDelete(template: TemplateRef<any>, type: string, param: any) {
    this.objDelete = param['id'];
    if(type == "delete") this.msg = "Confirma a exclusão do registro ?";
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.createForm();
    this.recoverLastSearchValue();
    this.getAll();
  }

  ngOnDestroy() {
    // this.preserveSearch.searchState = {};
    this.preserveSearch.searchState = {
      searchValue: this.formObject.value['objectFilter'],
      currentPage: this.currentPage,
      perPage: this.perPage
    };
  }

  handlerSearch(){
    if(this.formObject.invalid){
      return;
    }
    this.getAll();
  }

  handlerNew(){
      this.router.navigateByUrl(this.url_crud+'/create');
  }

  handlerEdit(id:number){
      this.router.navigateByUrl(this.url_crud+'/edit/'+id);
  }

  handlerDelete(){
    this.modalRef?.hide();
    this.isLoadingSearch = true;
    this.service.delete(this.objDelete).subscribe(
      (res) => {
        this.isLoadingSearch = false;
        
        this.snackbarService.success('Deletado com sucesso!');
        this.getAll();

      },
      (err) => {
        this.isLoadingSearch = false;
        this.snackbarService.success('Observer got an error: ' + err);
        
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  handlePageSizeChange(event) {
    this.perPage = event.target.value;
    this.currentPage = 1;
    this.getAll();
  }

  handlePageChange(event) {
    this.currentPage = event;
    this.getAll();
  }

  createForm(){
    this.formObject = this.formBuilder.group(
        {
        objectFilter: ['',[
            Validators.minLength(1),
            Validators.maxLength(100),
          ]],
        }
    );
  }

  recoverLastSearchValue() {
    const lastSearch = this.preserveSearch.searchState;
    if (lastSearch) {

        this.currentPage = lastSearch.currentPage || 1;
        this.perPage = lastSearch.perPage || 5;
        this.formControl.objectFilter.setValue(lastSearch.searchValue || "");
    }
  }

  get formControl() { return this.formObject.controls; }

  private getAll(){
    let _filter: string = this.formObject.value['objectFilter'];
  
    this.getAllByFilter(_filter, this.currentPage, this.perPage);

  }


  private getAllByFilter(filter: string, page: number = 1, perPage: number = 5) {
    this.isLoadingSearch = true;
    this.service.getAllByFilter(filter, page, perPage).subscribe(
      (res) => {
        this.objList = res.data;
        this.isLoading = false;
        this.isLoadingSearch = false;
        this.setPagination(res.meta);
      },
      (err) => {
        this.isLoading = false;
        this.isLoadingSearch = false;
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  setPagination(meta){
    this.currentPage = meta.currentPage;
    this.lastPage = meta.lastPage;
    this.total = meta.total;
  }
}
