import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IInputField, IMenu } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { PackageService } from 'src/app/core/services/package.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-new-menu',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})

export class NewMenuComponent implements OnInit {

    private url_crud: string = "/management/menu";
    public submitted = false;
    public isLoading = false;
    public msg: string = "No data"
    public title: string = "Novo Menu"
    public respEdit: IMenu = {};
    public objList = [];

    public objId = 0;
    public objIdDad = 0;
    private objSelectedItem = 0;

    modalRef?: BsModalRef;

    public formObject = new FormGroup({
        id: new FormControl(''),
        description: new FormControl('',
        [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        ]),     
        url: new FormControl(''),
        active: new FormControl(false),
        showSideBar: new FormControl(false),
        showHome: new FormControl(false),
        isClick: new FormControl(false),
        image: new FormControl(''),
        image_active: new FormControl(''),
        idDad: new FormControl(0),
        order: new FormControl(0)
    });

    public formFields: IInputField[] = [
        {
            id: 'Package',
            name: 'Package',
            showLabel: false,
            notNull: true,
            required: true,
            placeholder: '',
            type: 'select',
            options: [{
                id: "0",
                value: "0",
                name: "Choose an option",
                selected: true
            }]
        },
        {
          id: 'image_svg',
          name: 'Icone',
          showLabel: false,
          notNull: false,
          required: false,
          placeholder: '',
          type: 'select',
          options: [{
              id: "",
              value: "",
              name: "Choose an option",
              selected: true
          }]
      },
    ];

  constructor(
      private authservice: AuthService,
      private route: ActivatedRoute,
      private router: Router,
      private modalService: BsModalService,
      private service: MenuService,
      private snackbarService: SnackbarService
      
  ) {

    
   }

  ngOnInit(): void {
      this.getIcon();
      this.getObj();
  }

  get formControl() { return this.formObject.controls; }

  getObj(){
      var id = this.route.snapshot.params['id'];
      var idDad = this.route.snapshot.params['idDad'];
      
      this.objId = id;
      this.objIdDad = idDad;
      
      if (id != undefined && id != 0) {
          this.isLoading = true;
          this.service.get(id).subscribe(res => {
              this.respEdit = res;
              if (res.id) {
                  this.formControl.id.setValue(res.id);
                  this.formControl.description.setValue(res.description);
                  this.formControl.url.setValue(res.url);
                  this.formControl.active.setValue(res.active);
                  this.formControl.showSideBar.setValue(res.showSideBar);
                  this.formControl.showHome.setValue(res.showHome);
                  this.formControl.isClick.setValue(res.isClick);
                  this.formControl.image.setValue(res.image);
                  this.formControl.image_active.setValue(res.image_active);
                  this.formControl.idDad.setValue(res.idDad);
                  this.title = "Editar Menu";
              }
              else{
                  this.title = "Novo Menu";
                  this.snackbarService.error('Error: '+res);
              }
              this.getChildren(id);
              
          }, (err) => {
              this.title = "Novo Menu";
              this.showError(err);
              this.getChildren(id);
          });
          
      }else{
          this.formControl.id.setValue(0);

          if (this.objIdDad != undefined) {
            this.formControl.idDad.setValue(this.objIdDad);  
          }
          
          this.title = "Novo Menu";
          this.getChildren(id);
      }
  }

  getIcon(){
    this.formFields[1].options?.push(
      { id: "icon-add-circle.svg", value: "icon-add-circle.svg", name: "icon-add-circle.svg" },
      { id: "icon-cartrige-active.svg", value: "icon-cartrige-active.svg", name: "icon-cartrige-active.svg" },
      { id: "icon-cartrige.svg", value: "icon-cartrige.svg", name: "icon-cartrige.svg" },
      { id: "icon-ciclo.svg", value: "icon-ciclo.svg", name: "icon-ciclo.svg" },
      { id: "icon-conometro.svg", value: "icon-conometro.svg", name: "icon-conometro.svg" },
      { id: "icon-dashboard.svg", value: "icon-dashboard.svg", name: "icon-dashboard.svg" },
      { id: "icon-display-active.svg", value: "icon-display-active.svg  ", name: "icon-display-active.svg" },
      { id: "icon-display.svg", value: "icon-display.svg", name: "icon-display.svg" },
      { id: "icon-embalagem.svg", value: "icon-embalagem.svg", name: "icon-embalagem.svg" },
      { id: "icon-exit.svg", value: "icon-exit.svg", name: "icon-exit.svg" },
      { id: "icon-extraviada.svg", value: "icon-extraviada.svg", name: "icon-extraviada.svg" },
      { id: "icon-leituraitens.svg", value: "icon-leituraitens.svg", name: "icon-leituraitens.svg" },
      { id: "icon-logout.svg", value: "icon-logout.svg", name: "icon-logout.svg" },
      { id: "icon-menu-item.svg", value: "icon-menu-item.svg", name: "icon-menu-item.svg" },
      { id: "icon-money.svg", value: "icon-money.svg", name: "icon-money.svg" },
      { id: "icon-printer-active.svg", value: "icon-printer-active.svg", name: "icon-printer-active.svg" },
      { id: "icon-printer.svg", value: "icon-printer.svg", name: "icon-printer.svg" },
      { id: "icon-recycle-blue.svg", value: "icon-recycle-blue.svg    ", name: "icon-recycle-blue.svg" },
      { id: "icon-recycle.svg", value: "icon-recycle.svg", name: "icon-recycle.svg" },
      { id: "icon-setting.svg ", value: "icon-setting.svg", name: "icon-setting.svg" },
      { id: "icon-time.svg", value: "icon-time.svg", name: "icon-time.svg" },
      { id: "icon-user.svg", value: "icon-user.svg", name: "icon-user.svg" },
    );
  }

  onSubmit() {

      this.submitted = true;
      if(this.formObject.invalid){
        return;
      }

      this.isLoading = true;

      let _id: number = this.formObject.value['id'];
      let _description: string = this.formObject.value['description'];
      let _url: string = this.formObject.value['url'];
      let _active: boolean = this.formObject.value['active'];
      let _showSideBar: boolean = this.formObject.value['showSideBar'];
      let _showHome: boolean = this.formObject.value['showHome'];
      let _isClick: boolean = this.formObject.value['isClick'];
      let _image: string = this.formObject.value['image'];
      let _image_active: string = this.formObject.value['image_active'];
      let _idDad: number = parseInt(this.formObject.value['idDad']);
      let _order: number = parseInt(this.formObject.value['order']);

      let url = this.getUrl();

      if (_id > 0) {
          let obj: IMenu = {
              id: _id,
              description: _description,
              url: _url,
              active: _active,
              showSideBar: _showSideBar,
              showHome: _showHome,
              isClick: _isClick,
              image: _image,
              image_active: _image_active,
              idDad: _idDad,
              order: _order
          }

          this.service.edit(obj).subscribe(res => {
              this.snackbarService.messageRouter('Editado com sucesso!',['notification', 'success'],url);
              }, 
              (err) => 
              {
                this.showError(err);
              }
          );

      }
      else{

          let obj: IMenu = {
            description: _description,
            url: _url,
            active: _active,
            showSideBar: _showSideBar,
            showHome: _showHome,
            isClick: _isClick,
            image: _image,
            image_active: _image_active,
            idDad: _idDad,
            order: _order
          }

          this.service.save(obj).subscribe(res => {
              
              this.snackbarService.messageRouter('Salvo com sucesso!',['notification', 'success'],url);
              
              }, 
              (err) => 
              {
                this.showError(err);
              }
          );
      }     
  }

  onCancel(){

    var url = this.getUrl();

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {this.router.navigate([url])});    
  }

  getChildren(id: number) {
    this.isLoading = true;
    this.service.getAllChildren(id).subscribe(
      (res) => {
        this.objList = res;
        this.isLoading = false;
      },
      err => {
        this.showError(err);
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
        // this.formControl.package_id.setValue(this.respEdit.package_id != undefined ? this.respEdit.package_id : "0" );
      });
  }

  confirmDelete(template: TemplateRef<any>, type: string, param: any) {
    this.objSelectedItem = param['id'];
    if(type == "delete") this.msg = "Deletar o item '"+param['description']+"'?";
    this.modalRef = this.modalService.show(template);
  }

  handlerDelete(){
    this.modalRef?.hide();
    // this.isLoadingSearch = true;
    this.service.delete(this.objSelectedItem).subscribe(
      (res) => {
        // this.isLoadingSearch = false;
        
        this.snackbarService.success('Deletado com sucesso!');
        this.getChildren(this.objId);

      },
      (err) => {
        // this.isLoadingSearch = false;
        this.snackbarService.success('Observer got an error: ' + err);
        
      },
      async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
    });
  }

  getUrl(){
    var url = '';

    if (this.objId == undefined && this.objIdDad == undefined) {
        url = '/management/menu';
    }
    else if(this.objId != undefined && this.objIdDad == undefined){
        url = '/management/menu';
    }   
    else if(this.objId == 0 && this.objIdDad != undefined){
        url = '/management/menu/details/'+this.objIdDad;
    }
    else if(this.objId != undefined && this.objIdDad != undefined){
        url = '/management/menu/details/'+this.objIdDad;
    }

    return url;
  }

//   handlerEdit(template: TemplateRef<any>, type: string, param: any){
//     this.objSelectedItem = param['id'];
//     const config: ModalOptions = { class: 'modal-lg' };
//     this.modalRef = this.modalService.show(template, config);
//   }

  handlerEdit(id:number){
    var url = '/management/menu/details/'+id+'/'+this.objId;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {this.router.navigate([url])});
  }

  handlerNew(){
    var url = '/management/menu/details/0/'+this.objId;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {this.router.navigate([url])});
  }

  showError(err){
    this.isLoading = false;
    switch (err.error.statusCode) {
        case 403:
            this.snackbarService.error('Erro: Acesso não autorizado.');
            break;
    
        default:
            this.snackbarService.error('Erro: '+err.error.message);
            break;
    }
  }
}

