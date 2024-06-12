import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { AuthService } from "src/app/core/services/auth.service";
import { SnackbarService } from "src/app/core/services/snackbar.service";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
  })
export class ChangePasswordComponent implements OnInit 
{
    public formObject!: FormGroup;
    public submitted = false;
    public passValid = true;
    public isLoading = false;
    id: string = "";
    token: string = "";

    constructor(private formBuilder: FormBuilder, 
        public bsModalRef: BsModalRef, 
        private authservice: AuthService,
        private router: Router,
        private snackbarService: SnackbarService) {}

    get formControl() { return this.formObject.controls; }

    createForm(){
        this.formObject = this.formBuilder.group(
            {
            id: [''],
            novaSenha: ['',[
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(100),
            ]],
            confirmarNovaSenha: ['',[
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(100),
            ]]
            }
        );
    }

    ngOnInit() {
        this.createForm();
        this.formControl.id.setValue(0);
    }

    save() {
        this.submitted = true;
        
        if(this.formObject.invalid){
            return;
        }

        this.isLoading = true;
        let _novaSenha: string = this.formObject.value['novaSenha'];
        let _confirmarNovaSenha: string = this.formObject.value['confirmarNovaSenha'];

        if (_novaSenha == _confirmarNovaSenha) {
            this.passValid = true;
            this.authservice.changePassword(this.id, this.token, {
                password: _novaSenha,
                checkPassword: _confirmarNovaSenha
            }).subscribe(res => {
                if (res != null) {
                    this.isLoading = false;
                  
                    this.authservice.createSession(res);
                    // this.router.navigateByUrl('/home');
                    this.bsModalRef.hide();
                    this.router.navigate(['/home'])
                    .then(() => {
                        window.location.reload();
                    });
                }      
              }, (res) => {
                this.isLoading = false;
                this.bsModalRef.hide();
                if (res.error.statusCode > 400) {
                  this.snackbarService.error(''+ res.error.message);
                }
                else{
                  this.snackbarService.error('Erro inesperado, tente novamente dentro de alguns minutos ou contate o Admnistrador do Sistema.');
                }
              });    
        }
        else{
            this.passValid = false;
            this.isLoading = false;
        }        
    }

    cancel(){
        this.bsModalRef.hide();
    }
}