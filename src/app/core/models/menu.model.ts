


export interface IMenu {
    id?: number;
    active?: boolean;
    image?: string;
    image_active?: string;
    isClick?: boolean;
    description?: string;
    showHome?: boolean;
    showSideBar?: boolean;
    url?: string;
    idDad?: number;
    subitens?: IMenu[];
    classActive?: string;
    order?: number;
}

export class MenuDTO{
    id: number
    name: string
    image: string
    image_active: string
    url: string
    isClick: boolean
    idDad?: number
    active: boolean
    showSideBar:boolean
    showHome:boolean
    check?:boolean
    subitens: MenuDTO[]
    order: number
}