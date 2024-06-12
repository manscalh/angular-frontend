import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FieldCommonComponent } from '../field-common.component';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.component.html',
  styleUrls: ['./select-field.component.scss']
})
export class SelectFieldComponent extends FieldCommonComponent implements OnInit {
  @ViewChild('floatContainer', { static: true }) floatContainer: ElementRef;
  @ViewChild('floatField', { static: true }) floatField: ElementRef;

  ngOnInit() {
    
  }

  public formatText(txt: string): string{
    return txt;
  }
  
}
