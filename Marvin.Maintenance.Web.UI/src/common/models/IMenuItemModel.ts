import * as React from "react";

export default interface IMenuItemModel {
    Name: string;
    NavPath: string;
    SubMenuItems: IMenuItemModel[];
    Icon?: any;
    Content? : React.ReactNode;
}