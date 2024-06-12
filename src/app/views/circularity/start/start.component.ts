import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ICircularity, IInputField, IProduct, MenuDTO } from 'src/app/core/models';
import { AuthService } from 'src/app/core/services/auth.service';
import { CircularityService } from 'src/app/core/services/circularity.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SnackbarService } from 'src/app/core/services/snackbar.service';

@Component({
  selector: 'app-circularity-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartCircularityComponent implements OnInit {

    public submitted = false;
    public isLoading = false;
    public isSearchAutcomplete = false;
    public msg: string = "Nenhum registro"
    public title: string = "Início do Processo"
    public listSKU = Array<IProduct>();
    public listGeneralCondition = Array<any>();

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
        private CircularityService: CircularityService,
        private menuService: MenuService,
        private snackbarService: SnackbarService,
        private productService: ProductService
        
    ) { }

    ngOnInit(): void {
        this.createForm();
        this.getObj();
    }

    createForm(){
        this.formObject = this.formBuilder.group(
            {
            id: [0],
            serial: ['',[
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(100),
            ]],
            numberRecord: [''],
            sendEquipment: [false],
            SKU: [''],
            productId: new FormControl(0,  [
                Validators.required,
                Validators.min(1)
                ]),
            brandId: [''],
            weightProduct: [''],
            generalConditionId: new FormControl(0,  [
                Validators.required,
                Validators.min(1)
                ]),
            originId: [0],
            totalCountPrintPages: new FormControl(0,  [
                Validators.required,
                Validators.min(1)
                ]),
            currentSupplylevel: new FormControl(0,  [
                Validators.required,
                Validators.min(1)
                ]),
            currentInkLevel: [0],
            currentMaintenanceKitLevel: [0],
            printerCleaning: new FormControl('',  [
                Validators.required
                ]),
            replacementRepair: new FormControl('',  [
                Validators.required
                ]),
            commentReplacementRepair: [''],
            destinationId: [0],
            additionalNote: [''],
            circulatityStatusId: [1]
            }
        );
    }

    public formFields: IInputField[] = [
        {
            id: 'generalConditionId',
            name: 'Condição Geral',
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

        this.CircularityService.getGeneralCondition().subscribe(res => {
            this.listGeneralCondition = res;
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
        });

        var id = this.route.snapshot.params['id'];
        
        if (id != undefined) {
            this.isLoading = true;
            this.CircularityService.get(id).subscribe(res => {
                if (res.id) {
                    this.formControl.id.setValue(res.id);
                    this.formControl.productId.setValue(res.productId);
                }
                else{
                    this.snackbarService.error('Error: '+res);
                }                
                this.isLoading = false;
            }, (err) => {
                this.showError(err);
            });            
        }else{
            this.isLoading = false;
            this.formControl.id.setValue(0);
        }
    }

    onSubmit() {
        
        this.submitted = true;
        
        if(this.formObject.invalid){
            return;
        }

        this.isLoading = true;

        let _id: number = this.formObject.value['id'];
        let _serial: string = this.formObject.value['serial'];
        let _productId: number = parseInt(this.formObject.value['productId']);
        let _brandId: string = this.formObject.value['brandId'];
        let _numberRecord: string = this.formObject.value['numberRecord'];
        let _sendEquipment: boolean = Boolean(this.formObject.value['sendEquipment']);
        let _weightProduct: string = this.formObject.value['weightProduct'];
        let _generalConditionId: number = parseInt(this.formObject.value['generalConditionId']);
        let _originId: number = parseInt(this.formObject.value['originId']);
        let _totalCountPrintPages: number = parseInt(this.formObject.value['totalCountPrintPages']);
        let _currentSupplylevel: number = parseFloat(this.formObject.value['currentSupplylevel']);
        let _currentInkLevel: number = parseFloat(this.formObject.value['currentInkLevel']);
        let _currentMaintenanceKitLevel: number = parseFloat(this.formObject.value['currentMaintenanceKitLevel']);
        let _printerCleaning: boolean = Boolean(this.formObject.value['printerCleaning']);
        let _replacementRepair: boolean = Boolean(this.formObject.value['replacementRepair']);
        let _commentReplacementRepair: string = this.formObject.value['commentReplacementRepair'];
        let _destinationId: number = parseInt(this.formObject.value['destinationId']);
        let _additionalNote: string = this.formObject.value['additionalNote'];
        let _circulatityStatusId: number = parseInt(this.formObject.value['circulatityStatusId']);
        let _userCreatedId = this.authservice.getUser.id || "";
        
        if (_id > 0) {
            let obj: ICircularity = {
                id: _id,
                serial: _serial,
                productId: _productId,
                generalConditionId: _generalConditionId,
                originId: _originId,
                totalCountPrintPages: _totalCountPrintPages,
                currentSupplylevel: _currentSupplylevel,
                currentInkLevel: _currentInkLevel,
                currentMaintenanceKitLevel: _currentMaintenanceKitLevel,
                printerCleaning: _printerCleaning,    
                replacementRepair: _replacementRepair,
                commentReplacementRepair: _commentReplacementRepair,
                destinationId: _destinationId,
                additionalNote: _additionalNote,
                circulatityStatusId: _circulatityStatusId,
                userCreatedId: _userCreatedId,
                numberRecord: _numberRecord,
                sendEquipment: _sendEquipment

            }
            this.CircularityService.edit(obj).subscribe(res => {
                this.snackbarService.messageRouter('Editado com sucesso!',['notification', 'success'],'/circularity/list');
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }
        else{

            let obj: ICircularity = {
                serial: _serial,
                productId: _productId,
                generalConditionId: _generalConditionId,
                //originId: _originId,
                totalCountPrintPages: _totalCountPrintPages,
                currentSupplylevel: _currentSupplylevel,
                currentInkLevel: _currentInkLevel,
                currentMaintenanceKitLevel: _currentMaintenanceKitLevel,
                printerCleaning: _printerCleaning,    
                replacementRepair: _replacementRepair,
                commentReplacementRepair: _commentReplacementRepair,
                //destinationId: _destinationId,
                additionalNote: _additionalNote,
                circulatityStatusId: _circulatityStatusId,
                userCreatedId: _userCreatedId,
                sendEquipment: _sendEquipment
            }
            this.CircularityService.save(obj).subscribe(res => {
                
                this.snackbarService.messageRouter('Salvo com sucesso!',['notification', 'success'],'/circularity/list');
                
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }     
    }

    onNextStep() {
        
        this.submitted = true;
        
        if(this.formObject.invalid){
            return;
        }

        this.isLoading = true;

        let _id: number = this.formObject.value['id'];
        let _serial: string = this.formObject.value['serial'];
        let _productId: number = parseInt(this.formObject.value['productId']);
        let _brandId: string = this.formObject.value['brandId'];
        let _numberRecord: string = this.formObject.value['numberRecord'];
        let _sendEquipment: boolean = Boolean(this.formObject.value['sendEquipment']);
        let _weightProduct: string = this.formObject.value['weightProduct'];
        let _generalConditionId: number = parseInt(this.formObject.value['generalConditionId']);
        let _originId: number = parseInt(this.formObject.value['originId']);
        let _totalCountPrintPages: number = parseInt(this.formObject.value['totalCountPrintPages']);
        let _currentSupplylevel: number = parseFloat(this.formObject.value['currentSupplylevel']);
        let _currentInkLevel: number = parseFloat(this.formObject.value['currentInkLevel']);
        let _currentMaintenanceKitLevel: number = parseFloat(this.formObject.value['currentMaintenanceKitLevel']);
        let _printerCleaning: boolean = Boolean(this.formObject.value['printerCleaning']);
        let _replacementRepair: boolean = Boolean(this.formObject.value['replacementRepair']);
        let _commentReplacementRepair: string = this.formObject.value['commentReplacementRepair'];
        let _destinationId: number = parseInt(this.formObject.value['destinationId']);
        let _additionalNote: string = this.formObject.value['additionalNote'];
        let _circulatityStatusId: number = parseInt(this.formObject.value['circulatityStatusId']);
        let _userCreatedId = this.authservice.getUser.id || "";
        
        if (_id > 0) {
            let obj: ICircularity = {
                id: _id,
                serial: _serial,
                productId: _productId,
                generalConditionId: _generalConditionId,
                originId: _originId,
                totalCountPrintPages: _totalCountPrintPages,
                currentSupplylevel: _currentSupplylevel,
                currentInkLevel: _currentInkLevel,
                currentMaintenanceKitLevel: _currentMaintenanceKitLevel,
                printerCleaning: _printerCleaning,    
                replacementRepair: _replacementRepair,
                commentReplacementRepair: _commentReplacementRepair,
                destinationId: _destinationId,
                additionalNote: _additionalNote,
                circulatityStatusId: _circulatityStatusId,
                userCreatedId: _userCreatedId,
                numberRecord: _numberRecord,
                sendEquipment: _sendEquipment

            }
            this.CircularityService.nextStep(obj).subscribe(res => {
                this.snackbarService.messageRouter('Editado com sucesso!',['notification', 'success'],'/circularity/list');
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }
        else{

            let obj: ICircularity = {
                serial: _serial,
                productId: _productId,
                generalConditionId: _generalConditionId,
                //originId: _originId,
                totalCountPrintPages: _totalCountPrintPages,
                currentSupplylevel: _currentSupplylevel,
                currentInkLevel: _currentInkLevel,
                currentMaintenanceKitLevel: _currentMaintenanceKitLevel,
                printerCleaning: _printerCleaning,    
                replacementRepair: _replacementRepair,
                commentReplacementRepair: _commentReplacementRepair,
                //destinationId: _destinationId,
                additionalNote: _additionalNote,
                circulatityStatusId: _circulatityStatusId,
                userCreatedId: _userCreatedId,
                sendEquipment: _sendEquipment
            }
            this.CircularityService.nextStep(obj).subscribe(res => {
                
                this.snackbarService.messageRouter('Salvo com sucesso!',['notification', 'success'],'/circularity/list');
                
                }, 
                (err) => 
                {
                    this.showError(err);
                }
            );
        }     
    }

    onCancel(){
        this.router.navigateByUrl('/circularity/list');        
    }

    onKeypressEvent(event: any){
        
        if(event.target.value.length >= 2)
        {
            this.productService.getAllAutoComplete(event.target.value).subscribe(res => {
            //    console.log(res);
            this.listSKU = res;

            if (this.listSKU.length == 0) {
                this.listSKU.push({
                    "id": 0,
                    "description": "SKU não encontrado",
                    "SKU": "Clique Aqui para Cadastrar"
                    }
                );
            }

            

            this.isSearchAutcomplete = true;
            }, (err) => {
                this.showError(err);
            }); 
        }
    }

    onBlurAutoComplete(){
        setTimeout(() => {
            this.isSearchAutcomplete = false;
        }, 300);
    }

    onSelectedSKU(item){
        
        if (item.id != 0) {
            this.formControl.SKU.setValue(item.SKU);
            this.formControl.productId.setValue(item.id);
            this.formControl.weightProduct.setValue(item.weightString);
            this.formControl.brandId.setValue(item.brand.description);
            this.isSearchAutcomplete = false;
        }else{
            this.formControl.SKU.setValue("");
            this.formControl.productId.setValue("");
            this.formControl.weightProduct.setValue("");
            this.formControl.brandId.setValue("");
        }
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
