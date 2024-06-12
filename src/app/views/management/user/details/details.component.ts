import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IInputField, IUser } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';
import { GroupAccessService } from 'src/app/core/services/group-access.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CompanyService } from 'src/app/core/services/company.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class NewUserComponent implements OnInit {

    private url_crud: string = "/management/user";
    public submitted = false;
    public isLoading = false;
    public msg: string = "No data"
    public title: string = "Novo Usuário"
    public respEdit: IUser = {};
    public passDefault: string = "circularity@2024";
    public user: IUser;
    public groupAccessList: Array<any>;
    public isNew: boolean = true;

    modalRef?: BsModalRef;

    public formObject = new FormGroup({
        id: new FormControl(''),

        name: new FormControl('',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ]),

        email: new FormControl('',
        [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        ]),
        // user: new FormControl('',
        // [
        // Validators.required,
        // Validators.minLength(2),
        // Validators.maxLength(100),
        // ]),
        password: new FormControl(this.passDefault,
        [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        ]),
          
        status: new FormControl(false),
        changePassword: new FormControl(false),
        resetPasswordNextLogin: new FormControl(false),
        profileId: new FormControl(0, [
            Validators.required,
            Validators.min(1)
        ]),
        companyId: new FormControl(0,  [
            Validators.required,
            Validators.min(1)
            ])
    });

    public formFields: IInputField[] = [
        {
            id: 'GroupAccess',
            name: 'Grupo de Acesso',
            showLabel: false,
            notNull: true,
            required: true,
            placeholder: '',
            type: 'select',
            options: [{
                id: "0",
                value: 0,
                name: "Escolha uma opção",
                selected: true
            }]
        },
        {
            id: 'Company',
            name: 'Empresa',
            showLabel: false,
            notNull: true,
            required: true,
            placeholder: '',
            type: 'select',
            options: [{
                id: "0",
                value: 0,
                name: "Escolha uma opção",
                selected: true
            }]
        },
        {
            id: 'ChangePassword',
            name: 'Alterar Senha?',
            showLabel: false,
            notNull: false,
            required: false,
            placeholder: '',
            type: 'select',
            options: [{
                id: "1",
                value: "1",
                name: "Sim",
                selected: false
            },
            {
                id: "0",
                value: "0",
                name: "Não",
                selected: true
            }]
        }
    ];

    constructor(
        private authservice: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private service: UserService,
        private snackbarService: SnackbarService,
        private groupAccessService: GroupAccessService,
        private companyService: CompanyService
    ) {
        this.user = this.authservice.getUser;
        if(this.user.groupAccess != 'Administrador'){
            this.url_crud = "/management/user";
        }
     }

    ngOnInit(): void {
        this.getObj();
    }

    get formControl() { return this.formObject.controls; }

    getObj(){
        var id = this.route.snapshot.params['id'];
        
        if (id != undefined) {
            this.isLoading = true;
            this.service.get(id).subscribe(res => {
                this.isNew = false;
                this.respEdit = res;
                if (res.id) {
                    this.formControl.id.setValue(res.id);
                    this.formControl.name.setValue(res.name);
                    this.formControl.email.setValue(res.email);
                    // this.formControl.user.setValue(res.user);
                    // this.formControl.password.setValue(res.password);
                    this.formControl.password.setValue(this.passDefault);
                    this.formControl.status.setValue(res.active);
                    this.formControl.resetPasswordNextLogin.setValue(res.resetPasswordNextLogin);
                    this.title = "Editar Usuário";
                }
                else{
                    this.title = "Novo Usuário";
                    this.snackbarService.error('Error: '+res);
                }
                this.getGroupAccess();
                this.getCompany();
            }, (err) => {
                this.title = "Novo Usuário";
                this.showError(err);
                this.getGroupAccess();
                this.getCompany();
            });
        }
        else{
            this.formControl.id.setValue(0);
            this.formControl.password.setValue(this.passDefault);
            this.title = "Novo Usuário";
            this.getGroupAccess();
            this.getCompany();
            this.isNew = true;
        }


    }

    onSubmit() {

        if(this.user.groupAccess != 'Administrador'){
            
            let parceiroOp = this.groupAccessList.find(a => a.name == "Parceiro Operacional");

            this.formControl.profileId.setValue(parceiroOp.id);
            this.formControl.companyId.setValue(this.user.companyId || 0);
        }

        this.submitted = true;
        if(this.formObject.invalid){
            return;
        }

        this.isLoading = true;

        let _id: string = this.formObject.value['id'];
        let _name: string = this.formObject.value['name'];
        let _email: string = this.formObject.value['email'];
        let _user: string = this.formObject.value['user'];
        let _password: string = this.formObject.value['password'];
        let _status: boolean = this.formObject.value['status'];
        let _changePassword: boolean = this.formObject.value['changePassword'];
        let _resetPasswordNextLogin: boolean = this.formObject.value['resetPasswordNextLogin'];
        let _group_access: number = parseInt(this.formObject.value['profileId']);
        let _company: number = parseInt(this.formObject.value['companyId']);
        
        if(this.user.groupAccess != 'Administrador'){
            this.formControl.profileId.setValue(0);
            let parceiroOp = this.groupAccessList.find(a => a.name == "Parceiro Operacional");
            _group_access = parceiroOp.id;
            _company = this.user.companyId || 0;
        }

        if (_id != "") {
            let obj: IUser = {
                id: _id,
                name: _name,
                email: _email,
                // user: _user,
                password: _password,
                active: _status,
                profileId: _group_access,
                companyId: _company,
                changePassword: _changePassword,
                resetPasswordNextLogin: _resetPasswordNextLogin
            }

            this.service.edit(obj).subscribe(res => {
                this.snackbarService.messageRouter('Editado com sucesso!',['notification', 'success'],this.url_crud);
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }
        else{

            let obj: IUser = {
                name: _name,
                email: _email,
                user: _user,
                active: _status,
                password: _password,
                profileId: _group_access,
                resetPasswordNextLogin: _resetPasswordNextLogin,
                // changePassword: true,
                companyId: _company
            }
            this.service.save(obj).subscribe(res => {
                
                this.snackbarService.messageRouter('Salvo com sucesso!',['notification', 'success'],this.url_crud);
                
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }     
    }

    onCancel(){
        this.router.navigateByUrl(this.url_crud);
    }

    getGroupAccess() {
        this.isLoading = true;
        this.groupAccessService.getAll().subscribe(
          (res) => {
            this.groupAccessList = res;
            Object.values(res).map((value: any) => {
            
              //Group
              this.formFields[0].options?.push(
                {
                  id: value['id'],
                  value: value['id'],
                  name: value['name']
                }
              );
            });
            this.isLoading = false;    
          },
          err => { 
            this.showError(err);
        },
          async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            this.formControl.profileId.setValue(this.respEdit.profileId != undefined ? this.respEdit.profileId : "0" );
            //this.formControl.profileId.setValue("0");
          });
    }

    getCompany() {
        this.isLoading = true;
        this.companyService.getAll(1, 500).subscribe(
          (res) => {
            
            Object.values(res.data).map((value: any) => {
            
              //Group
              this.formFields[1].options?.push(
                {
                  id: value['id'],
                  value: value['id'],
                  name: value['name']
                }
              );
            });
            this.isLoading = false;    
          },
          err => {
            this.showError(err);
          },
          async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
            this.formControl.companyId.setValue(this.respEdit.companyId != undefined ? this.respEdit.companyId : "0" );
            //this.formControl.profileId.setValue("0");
          });
    }

    showError(err){
        this.isLoading = false;
        switch (err.error.statusCode) {
            case 403:
                this.snackbarService.error('Erro: Acesso não autorizado.');
                break;

            case 409:
                this.snackbarService.error('Erro: E-mail já cadastrado na base de dados.');
                break;
        
            default:
                this.snackbarService.error('Erro: '+err.error.message);
                break;
        }
    }
}
