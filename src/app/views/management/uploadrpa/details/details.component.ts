import { formatDate } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IInputField, IUploadRPA } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { UploadRPAService } from 'src/app/core/services/uploadrpa.service';

@Component({
  selector: 'app-new-uploadrpa',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class NewUploadRPAComponent implements OnInit {

    private url_crud: string = "/management/uploadrpa";
    public submitted = false;
    public isLoading = false;
    public msg: string = "No data"
    public title: string = "Novo Cadastro"
    public respEdit: IUploadRPA = {};
    public customerpn: IUploadRPA;
    public isNew: boolean = true;

    modalRef?: BsModalRef;

    public formObject = new FormGroup({
        id: new FormControl(''),

        cliente: new FormControl('',
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

        quantidade: new FormControl('',
        [
        Validators.required,
        ]),

        data: new FormControl('',
        [
        Validators.required,
        ]),

        voo: new FormControl('',
        [
            Validators.nullValidator
        ]),
       
    });

    public formFields: IInputField[] = [

        {
            id: 'voo',
            name: 'voo',
            showLabel: false,
            notNull: false,
            required: false,
            placeholder: '',
            type: 'select',
            options: [
            {
                id: "1",
                value: "CONVENCIONAL",
                name: "CONVENCIONAL",
                selected: false
            },
            {
                id: "2",
                value: "EXPRESSO JAG",
                name: "EXPRESSO JAG",
                selected: false
            },
            {
                id: "3",
                value: "EXPRESSO MNS",
                name: "EXPRESSO MNS",
                selected: false
            },
            {
                id: "0",
                value: "0",
                name: "Escolha uma opção",
                selected: true
            }]
        }
    ];

    constructor(
        private authservice: AuthService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private service: UploadRPAService,
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
                    this.formControl.cliente.setValue(res.cliente);
                    this.formControl.partnumber.setValue(res.partnumber);
                    this.formControl.quantidade.setValue(res.quantidade);
                    this.formControl.data.setValue(formatDate(res.data, 'dd/MM/yyyy', 'en-US','+0400'));
                    this.formControl.voo.setValue(res.voo);
                    this.title = "Editar Upload SSD";
                }
                else{
                    this.title = "Novo Upload SSD";
                    this.snackbarService.error('Error: '+res);
                }
                this.isLoading = false;   

            }, (err) => {
                this.title = "Novo Upload SSD";
                this.showError(err);
                this.isLoading = false; 
            });
        }
        else{
            this.formControl.id.setValue(0);
            this.formControl.clietne.setValue("");
            this.formControl.partnumber.setValue("");
            this.formControl.quantidade.setValue(0);
            this.formControl.data.setValue(new Date());
            this.formControl.voo.setValue("");
            this.title = "Novo Upload SSD";
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
        let _cliente: string = this.formObject.value['cliente'];
        let _quantidade: number = this.formObject.value['quantidade'];
        let _partnumber: string = this.formObject.value['partnumber'];
        let _voo: string = this.formObject.value['voo'];


        if (_id != "") {
            let obj: IUploadRPA = {
                id: +_id,
                cliente: _cliente,
                partnumber: _partnumber,
                quantidade: _quantidade,
                voo: _voo

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

            let obj: IUploadRPA = {
                id: +_id,
                cliente: _cliente,
                partnumber: _partnumber,
                quantidade: _quantidade,
                voo: _voo
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
