export interface ICircularity {
    id?: number;
    serial?: string;
    numberRecord?: string;
    sendEquipment?: boolean;
    productId?: number;
    generalConditionId?: number;
    originId?: number;
    totalCountPrintPages?: number;
    currentSupplylevel?: number;
    currentInkLevel?: number;
    currentMaintenanceKitLevel?: number;
    printerCleaning?: boolean;    
    replacementRepair?: boolean;
    commentReplacementRepair?: string;
    destinationId?: number;
    additionalNote?: string;
    circulatityStatusId?: number;
    userCreatedId?: string;
    deleted?: boolean;
}
  