import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ICompany, MenuDTO } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-new-company',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class NewCompanyComponent implements OnInit {

    public submitted = false;
    public isLoading = false;
    public msg: string = "Nenhum registro"
    public title: string = "Nova Empresa Parceira"

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
        private CompanyService: CompanyService,
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
            cnpj: ['',[
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]],
            active: [false],
            allowAdd: [false],
            allowSave: [false],
            allowEdit: [false],
            allowDelete: [false],
            allowView: [false],
            }
        );
    }

    get formControl() { return this.formObject.controls; }

    getObj(){
        var id = this.route.snapshot.params['id'];
        
        if (id != undefined) {
            this.isLoading = true;
            this.CompanyService.get(id).subscribe(res => {
                if (res.id) {
                    this.formControl.id.setValue(res.id);
                    this.formControl.name.setValue(res.name);
                    this.formControl.cnpj.setValue(res.CNPJ);
                    this.formControl.active.setValue(res.active);
                    this.title = "Editar Empresa Parceira";
                }
                else{
                    this.title = "Nova Empresa Parceira";
                    this.snackbarService.error('Error: '+res);
                }                
                this.isLoading = false;
            }, (err) => {
                this.showError(err);
                this.title = "Nova Empresa Parceira";
            });            
        }else{
            this.isLoading = false;
            this.formControl.id.setValue(0);
            this.title = "Nova Empresa Parceira";
        }
    }

    onSubmit() {
        
        this.submitted = true;
        
        if(this.formObject.invalid){
            return;
        }

        this.isLoading = true;

        let _id: number = this.formObject.value['id'];
        let _name: string = this.formObject.value['name'];
        let _cnpj: string = this.formObject.value['cnpj'];
        let _active: boolean = this.formObject.value['active'];
        
        if (_id > 0) {
            let obj: ICompany = {
                id: _id,
                name: _name,
                CNPJ: _cnpj,
                active: _active
            }
            this.CompanyService.edit(obj).subscribe(res => {
                this.snackbarService.messageRouter('Editado com sucesso!',['notification', 'success'],'/management/company');
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }
        else{

            let obj: ICompany = {
                name: _name,
                active: _active,
                CNPJ: _cnpj,
            }
            this.CompanyService.save(obj).subscribe(res => {
                
                this.snackbarService.messageRouter('Salvo com sucesso!',['notification', 'success'],'/management/company');
                
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }     
    }

    onCancel(){
        this.router.navigateByUrl('/management/company');
        // this.authservice.redirectTo('/management/company');
    }

    showError(err){
        this.isLoading = false;
        
        switch (err.error.statusCode) {
            case 403:
                this.snackbarService.error('Erro: Acesso não autorizado.');
                break;

            case 409:
                this.snackbarService.error('Erro: CNPJ já cadastrado na base de dados.');        
                break;
        
            default:
                this.snackbarService.error('Erro: '+err.error.message);
                break;
        }
    }
}
