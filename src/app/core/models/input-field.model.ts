export interface IInputField {
    id: string;
    name?: string;
    showLabel?: boolean;
    required?: boolean;
    notNull?: boolean;
    type: string;
    value?: any;
    options?: SelectOptions[];
    placeholder?: string;
    icon?: string;
  }
  
  export interface SelectOptions {
    id: string;
    name: string;
    value: string | number | boolean;
    count?: number;
    disabled?: boolean;
    selected?: boolean;
  }
  