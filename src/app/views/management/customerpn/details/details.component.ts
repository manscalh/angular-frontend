import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ICustomerPN, IInputField } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { CompanyService } from 'src/app/core/services/company.service';
import { CustomerPNService } from 'src/app/core/services/customerpn.service';

@Component({
  selector: 'app-new-customerpn',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class NewCustomerPNComponent implements OnInit {

    private url_crud: string = "/management/customerpn";
    public submitted = false;
    public isLoading = false;
    public msg: string = "No data"
    public title: string = "Novo Cliente"
    public respEdit: ICustomerPN = {};
    public customerpn: ICustomerPN;
    public isNew: boolean = true;

    modalRef?: BsModalRef;

    public formObject = new FormGroup({
        id: new FormControl(''),

        customer: new FormControl('',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(6),
        ]),

        partnumber: new FormControl('',
        [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
        ]),
       
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
        private service: CustomerPNService,
        private snackbarService: SnackbarService,

    ) {}

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
                    this.formControl.customer.setValue(res.customer);
                    this.formControl.partnumber.setValue(res.partnumber);
                    this.title = "Editar Cliente & Partnumber";
                }
                else{
                    this.title = "Novo Cliente & Partnumber";
                    this.snackbarService.error('Error: '+res);
                }
                this.isLoading = false;   

            }, (err) => {
                this.title = "Novo Cliente & Partnumber";
                this.showError(err);
                this.isLoading = false; 
            });
        }
        else{
            this.formControl.id.setValue(0);
            this.formControl.customer.setValue("");
            this.formControl.partnumber.setValue("");
            this.title = "Novo Cliente & Partnumber";
            this.isNew = true;
        }


    }

    onSubmit() {

        this.submitted = true;
        if(this.formObject.invalid){
            return;
        }

        this.isLoading = true;

        let _id: string = this.formObject.value['id'];
        let _customer: string = this.formObject.value['customer'];
        let _partnumber: string = this.formObject.value['partnumber'];


        if (_id != "") {
            let obj: ICustomerPN = {
                id: +_id,
                customer: _customer,
                partnumber: _partnumber,

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

            let obj: ICustomerPN = {
                id: +_id,
                customer: _customer,
                partnumber: _partnumber,
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
