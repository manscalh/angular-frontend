import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService } from 'src/app/core/services/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formUser!: FormGroup;
  public submitted = false;
  public isLoading = false;
  public msg: string = "No data"

  modalRef?: BsModalRef;
 
  openModal(template: TemplateRef<any>, type: string) {
    if(type == "newregister") this.msg = "To access the BI Lhasa system, send an email to ismael@fit-tecnologia.org.br."
    if(type == "forgotpassword") this.msg = "To request a new access to the BI Lhasa system, send an email to ismael@fit-tecnologia.org.br."
    this.modalRef = this.modalService.show(template);
  }
  
  constructor(
    private authservice: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  onEnterKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  createForm() {
    this.formUser = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
  });
  }

  get fUser() { return this.formUser.controls; }

  onSubmit() {
    this.submitted = true;
    if(this.formUser.invalid){
      return;
    }

    this.isLoading = true;

    let username: string = this.formUser.value['username'];
    let password: string = this.formUser.value['password'];

    this.authservice.signin(username, password).subscribe(res => {
      if (res != null) {
        this.isLoading = false;
        
        if (res.user.resetPasswordNextLogin) {
          const initialState = { id: res.user.id, token: res.accessToken };
          this.modalRef = this.modalService.show(ChangePasswordComponent, {initialState});
        }
        else{
          this.authservice.createSession(res);
          // this.router.navigateByUrl('/home');
          this.router.navigate(['/home'])
          .then(() => {
            window.location.reload();
          });
        }
      }      
    }, (res) => {
      this.isLoading = false;
      if (res.error.statusCode > 400) {
        this.snackbarService.error(''+ res.error.message);
      }
      else{
        this.snackbarService.error('Erro inesperado, tente novamente dentro de alguns minutos ou contate o Admnistrador do Sistema.');
      }
    });    
  }
}
