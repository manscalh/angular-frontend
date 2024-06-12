import { Input, Directive } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';
import { IInputField } from 'src/app/core/models';


@Directive()
export class FieldCommonComponent {
  @Input() control: FormControl;
  @Input() field: IInputField;
}
