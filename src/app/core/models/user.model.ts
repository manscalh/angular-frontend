import { IMenu } from "./menu.model";

export interface IUser {
    id?: string;
    name?: string;
    email?: string;
    user?: string;
    password?: string;
    lastLogin?: string;
    created_at?: string;
    updated_at?: string;
    profileId?: number;
    companyId?: number;
    active?: boolean;

    username?: string;
    token?: string;
    groupAccess?: string;
    expires?: string;
    menu?: IMenu[];
    menuHome?: IMenu[];
    allowAdd?: boolean;
    allowSave?: boolean;
    allowEdit?: boolean;
    allowDelete?: boolean;
    allowView?: boolean;

    resetPasswordNextLogin?: boolean;
    changePassword?: boolean;
}
  