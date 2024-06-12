import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IInputField, IProduct, MenuDTO } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductService } from 'src/app/core/services/product.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { BrandService } from 'src/app/core/services/brand.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-product',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class NewProductComponent implements OnInit {

    public submitted = false;
    public isLoading = false;
    public msg: string = "Nenhum registro"
    public title: string = "Novo Produto"
    public respEdit: IProduct = {};
    public isNew: boolean = true;

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
        private ProductService: ProductService,
        private menuService: MenuService,
        private snackbarService: SnackbarService,
        private brandService: BrandService
        
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.getObj();
    }

    createForm(){
        this.formObject = this.formBuilder.group(
            {
            id: [''],
            SKU: ['',[
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]],
            description: ['',[
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]],
            family: [' '],
            // family: ['',[
            //     Validators.required,
            //     Validators.minLength(2),
            //     Validators.maxLength(100),
            // ]],
            weight: ['',[
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(10),
                this.decimalValidator()
            ]],
            brandId: new FormControl(0,  [
                Validators.required,
                Validators.min(1)
                ]),
            weightString: [''],
            active: [false],
            statusProduct: [false],
            allowAdd: [false],
            allowSave: [false],
            allowEdit: [false],
            allowDelete: [false],
            allowView: [false],
            }
        );
    }

    public formFields: IInputField[] = [
        {
            id: 'BrandId',
            name: 'Marca',
            showLabel: false,
            notNull: true,
            required: true,
            placeholder: '',
            type: 'select',
            options: [{
                id: "0",
                value: "0",
                name: "Escolha uma opção",
                selected: true
            }]
        }
    ];

    get formControl() { return this.formObject.controls; }

    getObj(){
        var id = this.route.snapshot.params['id'];
        
        if (id != undefined) {
            this.isLoading = true;
            this.ProductService.get(id).subscribe(res => {
                this.isNew = false;
                this.respEdit = res;
                if (res.id) {
                    this.formControl.id.setValue(res.id);
                    this.formControl.description.setValue(res.description);
                    this.formControl.SKU.setValue(res.SKU);
                    // this.formControl.family.setValue(res.family);
                    this.formControl.weight.setValue(res.weightString);
                    this.title = "Editar Produto";
                }
                else{
                    this.title = "Novo Produto";
                    this.snackbarService.error('Error: '+res);
                }    
                // this.isLoading = false;
                this.getBrand();            
            }, (err) => {
                this.getBrand();
                this.showError(err);
                this.title = "Novo Produto";
            });            
        }else{
            this.getBrand(); 
            this.isLoading = false;
            this.formControl.id.setValue(0);
            this.title = "Novo Produto";      
            this.isNew = false;   
        }
    }

    onSubmit() {
        
        this.submitted = true;
        
        if(this.formObject.invalid){
            return;
        }

        this.isLoading = true;

        let _id: number = this.formObject.value['id'];
        let _description: string = this.formObject.value['description'];
        let _SKU: string = this.formObject.value['SKU'];
        // let _family: string = this.formObject.value['family'];
        let _family: string = ' '
        let _weight: number = this.formObject.value['weight'];
        let _brand: number = parseInt(this.formObject.value['brandId']);
        let _statusProduct: boolean = true
        
        if (_id > 0) {
            let obj: IProduct = {
                id: _id,
                description: _description,
                SKU: _SKU,
                family: _family,
                weight: _weight,
                brandId: _brand,
                statusProduct: _statusProduct
                
            }
            this.ProductService.edit(obj).subscribe(res => {
                this.snackbarService.messageRouter('Editado com sucesso!',['notification', 'success'],'/management/products');
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }
        else{

            let obj: IProduct = {
              description: _description,
              SKU: _SKU,
              family: _family,
              weight: _weight,
              brandId: _brand,
              statusProduct: _statusProduct
            }
            this.ProductService.save(obj).subscribe(res => {
                
                this.snackbarService.messageRouter('Salvo com sucesso!',['notification', 'success'],'/management/products');
                
                }, 
                (err) => 
                {
                    this.showError(err);
                    console.log(err);
                }
            );
        }     
    }

    onCancel(){
        this.router.navigateByUrl('/management/products');
    }

    getBrand() {
        this.isLoading = true;
        this.brandService.getAll().subscribe(
          (res) => {
            
            Object.values(res).map((value: any) => {
            
              //Group
              this.formFields[0].options?.push(
                {
                  id: value['id'],
                  value: value['id'],
                  name: value['description']
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
            this.formControl.brandId.setValue(this.respEdit.brandId != undefined ? this.respEdit.brandId : "0" );
          });
    }

    // decimalValidator() {
    //     return (control: FormControl) => {
    //       const value = control.value;
      
    //       if (value !== null && value !== undefined && value !== '') {
         
    //         const regex = /^\d+(\.\d{1,2})?$/;
    //         const isValid = regex.test(value);
      
    //         return isValid ? null : { invalidDecimal: true };
    //       }
      
    //       return null;
    //     };
    //   }

      decimalValidator() {
        return (control: FormControl) => {
          const value = control.value;
      
          if (value !== null && value !== undefined && value !== '') {
            const regex = /^\d+(\.\d{1,2})?$/;
            const isValidFormat = regex.test(value);
      
            const isValidValue = parseFloat(value) > 0;
      
            return isValidFormat && isValidValue ? null : { invalidDecimal: true };
          }
      
          return null;
        };
      }
      

    showError(err){
        this.isLoading = false;
        
        switch (err.error.statusCode) {
            case 403:
                this.snackbarService.error('Erro: Acesso não autorizado.');
                break;

            case 409:
                this.snackbarService.error('Error: SKU já cadastrado na base de dados.');        
                break;
        
            default:
                this.snackbarService.error('Error: '+err.error.message);
                break;
        }
    }
}
