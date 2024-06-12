import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MenuService } from 'src/app/core/services/menu.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public isVisibleCard: boolean = true;
  public isLoading = true;
  public isLoadingSearch = false;
  public objList = [];
  public formObject!: FormGroup;
  public msg: string = "No data";
  modalRef?: BsModalRef;
  private objDelete = 0;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private modalService: BsModalService
    ) { }

    confirmDelete(template: TemplateRef<any>, type: string, param: any) {
      this.objDelete = param['id'];
      if(type == "delete") this.msg = "Confirma a exclusão do registro "+param['name']+"?";
      this.modalRef = this.modalService.show(template);
    }
  
    ngOnInit(): void {
      this.createForm();
      this.getAll();
    }

    opened(){
      this.isVisibleCard = !this.isVisibleCard
    }
  
    handlerSearch(){
      if(this.formObject.invalid){
        return;
      }
  
      let _filter: string = this.formObject.value['objectFilter'];
  
      if (_filter.length > 0) {
        this.getAllByFilter(_filter);  
      }else{
        this.getAll();
      }
    }
  
    handlerNew(){
      this.router.navigateByUrl('/management/menu/details');
    }
  
    handlerEdit(id:number){
      this.router.navigateByUrl('/management/menu/details/'+id);
    }
  
    handlerDelete(){
      this.modalRef?.hide();
      this.isLoadingSearch = true;
      this.menuService.delete(this.objDelete).subscribe(
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
          objectFilter: ['',[
              Validators.minLength(1),
              Validators.maxLength(100),
            ]],
          }
      );
    }
  
    private getAll() {
      this.isLoadingSearch = true;
      this.menuService.getAll().subscribe(
        (res) => {
          
          this.objList = res.data;
          this.isLoading = false;
          this.isLoadingSearch = false;
  
        },
        (err) => {
          
          this.isLoading = false;
          this.isLoadingSearch = false;
          // console.log(err);
        },
        async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
      });
    }
  
    private getAllByFilter(filter: string) {
      this.isLoadingSearch = true;
      this.menuService.getAllByFilter(filter).subscribe(
        (res) => {
          this.objList = res.data;
          this.isLoading = false;
          this.isLoadingSearch = false;
        },
        (err) => {
          
          this.isLoading = false;
          this.isLoadingSearch = false;
          // console.log(err);
        },
        async () => {
          await new Promise(resolve => setTimeout(resolve, 0));
      });
    }
  }
  