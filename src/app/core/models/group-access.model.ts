export interface IGroupAccess {
    id?: number;
    name?: string;
    active?: boolean;
    createdAt?: string;
    updatedAt?: string;
    arrayMenu?: Array<number>;    
    allowAdd?: boolean;
    allowSave?: boolean;
    allowEdit?: boolean;
    allowDelete?: boolean;
    allowView?: boolean;
}
  