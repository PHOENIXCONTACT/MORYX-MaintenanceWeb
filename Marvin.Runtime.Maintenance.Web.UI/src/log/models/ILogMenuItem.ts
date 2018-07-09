import MenuItemModel from "../../common/models/IMenuItemModel";
import LoggerModel from '../models/LoggerModel';

export default interface LogMenuItem extends MenuItemModel
{
    Logger:LoggerModel;
}