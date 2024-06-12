import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PreserveSearchProductService } from 'src/app/core/filters/product.filter';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public isVisibleCard: boolean = true;
  public isLoading = true;
  public isLoadingSearch = false;
  public objList = [];
  public formObject!: FormGroup;
  public msg: string = "No data";
  modalRef?: BsModalRef;
  private objDelete = 0;
  public p: number = 1;
  public currentPage: number = 1;
  public lastPage: number = 1;
  public perPage: number = 5;
  public total: number = 0;

  public pageSizes: Array<number> = [5,10,25,50];

  constructor(
    private router: Router,
    private ProductService: ProductService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private modalService: BsModalService,
    public auth: AuthService,
    private preserveSearch: PreserveSearchProductService
    ) { }

  confirmDelete(template: TemplateRef<any>, type: string, param: any) {
    this.objDelete = param['id'];
    if(type == "delete") this.msg = "Confirma a exclusão do registro "+param['SKU']+"?";
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit(): void {
    this.createForm();
    this.recoverLastSearchValue();
    this.onSearchItems();
  }

  ngOnDestroy() {
    // this.preserveSearch.searchState = {};
    this.preserveSearch.searchState = {
      searchValue: this.formObject.value['searchValue'],
      currentPage: this.currentPage,
      perPage: this.perPage
    };
  }

  opened(){
    this.isVisibleCard = !this.isVisibleCard
  }

  handlerSearch(){
    this.currentPage = 1;
    this.lastPage = 1;
    this.total = 0;
    this.onSearchItems();
  }

  onSearchItems(){
    if(this.formObject.invalid){
      return;
    }

    let _filter: string = this.formObject.value['searchValue'];

    if (_filter.length > 0) {
      this.getAllByFilter(_filter, this.currentPage, this.perPage);  
    }else{
      this.getAll(this.currentPage, this.perPage);
    }
  }

  handlerNew(){
    this.router.navigateByUrl('/management/products/details');
  }

  handlerEdit(id:number){
    this.router.navigateByUrl('/management/products/details/'+id);
  }

  handlerDelete(){
    this.modalRef?.hide();
    this.isLoadingSearch = true;
    this.ProductService.delete(this.objDelete).subscribe(
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

  createForm(){
    this.formObject = this.formBuilder.group(
      {
        searchValue: 
        [
          '',[Validators.minLength(1),Validators.maxLength(100),]
        ],
        rowPerPage: [0],
      }
    );
  }

  handlePageChange(event) {
    this.currentPage = event;
    this.onSearchItems();
  }

  handlePageSizeChange(event) {
    this.perPage = event.target.value;
    this.currentPage = 1;
    this.onSearchItems();
  }

  setPagination(meta){
    this.currentPage = meta.currentPage;
    this.lastPage = meta.lastPage;
    this.total = meta.total;
  }

  recoverLastSearchValue() {
    const lastSearch = this.preserveSearch.searchState;
    if (lastSearch) {

        this.currentPage = lastSearch.currentPage || 1;
        this.perPage = lastSearch.perPage || 5;
        this.formControl.searchValue.setValue(lastSearch.searchValue || "");
    }
  }

  get formControl() { return this.formObject.controls; }

  private getAll(page: number = 1, perPage: number = 5) {
    this.isLoadingSearch = true;
    this.ProductService.getAll(page, perPage).subscribe(
      (res) => {
            
        this.objList = res.data;
        this.isLoading = false;
        this.isLoadingSearch = false;
        this.setPagination(res.meta);
        
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

  private getAllByFilter(filter: string, page: number = 1, perPage: number = 5) {
    this.isLoadingSearch = true;
    this.ProductService.getAllByFilter(filter, page, perPage).subscribe(
      (res) => {
        
        this.objList = res.data;
        this.isLoading = false;
        this.isLoadingSearch = false;
        this.setPagination(res.meta);
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

}
