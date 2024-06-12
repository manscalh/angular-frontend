import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IGroupAccess, MenuDTO } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { GroupAccessService } from 'src/app/core/services/group-access.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-new-group-access',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class NewGroupAccessComponent implements OnInit {

    public submitted = false;
    public isLoading = false;
    public msg: string = "Nenhum registro"
    public title: string = "Novo Grupo de Acesso"

    modalRef?: BsModalRef;

    public formObject!: FormGroup;

    public sourceMenu = Array<MenuDTO>();
    public confirmedMenu = Array<MenuDTO>();
    
    constructor(
        private authservice: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private formBuilder: FormBuilder,
        private modalService: BsModalService,
        private groupAccessService: GroupAccessService,
        private menuService: MenuService,
        private snackbarService: SnackbarService
        
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.getObj();
    }

    createForm(){
        this.formObject = this.formBuilder.group(
            {
            id: [''],
            name: ['',[
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
              ]],
            active: [false],
            allowAdd: [true],
            allowSave: [true],
            allowEdit: [true],
            allowDelete: [true],
            allowView: [true],
            }
        );
    }

    get formControl() { return this.formObject.controls; }

    getObj(){
        var id = this.route.snapshot.params['id'];
        
        if (id != undefined) {
            this.isLoading = true;
            this.groupAccessService.get(id).subscribe(res => {
                if (res.id) {
                    this.formControl.id.setValue(res.id);
                    this.formControl.name.setValue(res.name);
                    this.formControl.active.setValue(res.active);
                    this.formControl.allowAdd.setValue(res.allowAdd);
                    this.formControl.allowSave.setValue(res.allowSave);
                    this.formControl.allowEdit.setValue(res.allowEdit);
                    this.formControl.allowDelete.setValue(res.allowDelete);
                    this.formControl.allowView.setValue(res.allowView);
                    this.title = "Editar Grupo de Acesso";
                }
                else{
                    this.title = "Novo Grupo de Acesso";
                    this.snackbarService.error('Error: '+res);
                }

                this.getMenuSubItens(id);
            }, (err) => {
                this.showError(err);
                this.title = "Novo Grupo de Acesso";
            });

            
            
        }else{
            this.isLoading = true;
            this.getMenuSubItens(0);
            this.formControl.id.setValue(0);
            this.title = "Novo Grupo de Acesso";
        }
    }

    onSubmit() {
        
        this.submitted = true;
        var _arrayMenu = Array<number>();
        _arrayMenu = this.getChekedSource(this.sourceMenu, _arrayMenu);

        if(this.formObject.invalid){
            return;
        }

        this.isLoading = true;

        let _id: number = this.formObject.value['id'];
        let _name: string = this.formObject.value['name'];
        let _active: boolean = this.formObject.value['active'];
        let _allowAdd: boolean = this.formObject.value['allowAdd'];
        let _allowSave: boolean = this.formObject.value['allowSave'];
        let _allowEdit: boolean = this.formObject.value['allowEdit'];
        let _allowDelete: boolean = this.formObject.value['allowDelete'];
        let _allowView: boolean = this.formObject.value['allowView'];

        if (_id > 0) {
            let obj: IGroupAccess = {
                id: _id,
                name: _name,
                active: _active,
                allowAdd: _allowAdd,
                allowSave: _allowSave,
                allowEdit: _allowEdit,
                allowDelete: _allowDelete,
                allowView: _allowView,
                arrayMenu: _arrayMenu
            }
            this.groupAccessService.edit(obj).subscribe(res => {
                this.snackbarService.messageRouter('Editado com sucesso!',['notification', 'success'],'/management/group-access');
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }
        else{

            let obj: IGroupAccess = {
                name: _name,
                active: _active,
                allowAdd: _allowAdd,
                allowSave: _allowSave,
                allowEdit: _allowEdit,
                allowDelete: _allowDelete,
                allowView: _allowView,
                arrayMenu: _arrayMenu
            }
            this.groupAccessService.save(obj).subscribe(res => {
                
                this.snackbarService.messageRouter('Salvo com sucesso!',['notification', 'success'],'/management/group-access');
                
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }     
    }

    onCancel(){
        this.router.navigateByUrl('/management/group-access');
    }

    getMenuSubItens(id: number){
        this.menuService.getMenuSubitens(id).subscribe(res => {
            this.isLoading = false;
            this.sourceMenu = res.source;
            this.confirmedMenu = res.source;
        }, (err) => {
            this.showError(err);
            this.title = "Novo Grupo de Acesso";
        });
    }

    getChekedSource(array: Array<MenuDTO>, objReturn: Array<number> ){
        var list = array;
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            if (element.check) {
                objReturn.push(element.id);    
            }
            objReturn = this.getChekedSource(element.subitens, objReturn);
        }
        return objReturn;
    }

    onCheckMenu(check: boolean, posMenu: number[]){
        // console.log(posMenu);
        if (check) {
            
            if (posMenu.length == 1) {
                this.sourceMenu[posMenu[0]].check=false;    
            }
            
            if (posMenu.length == 2){
                this.sourceMenu[posMenu[0]].subitens[posMenu[1]].check=false;    
            }

            if (posMenu.length == 3){
                this.sourceMenu[posMenu[0]].subitens[posMenu[1]].subitens[posMenu[2]].check=false;
            }

            if (posMenu.length == 4){
                this.sourceMenu[posMenu[0]].subitens[posMenu[1]].subitens[posMenu[2]].subitens[posMenu[3]].check=false;
            }
        }
        else{
            if (posMenu.length == 1) {
                this.sourceMenu[posMenu[0]].check=true;    
            }
            
            if (posMenu.length == 2){
                this.sourceMenu[posMenu[0]].subitens[posMenu[1]].check=true;    
            }

            if (posMenu.length == 3){
                this.sourceMenu[posMenu[0]].subitens[posMenu[1]].subitens[posMenu[2]].check=true;
            }

            if (posMenu.length == 4){
                this.sourceMenu[posMenu[0]].subitens[posMenu[1]].subitens[posMenu[2]].subitens[posMenu[3]].check=true;
            }
        }
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
