import IMenuItemModel from "../../common/models/IMenuItemModel";
import LoggerModel from '../models/LoggerModel';

export default interface ILogMenuItem extends IMenuItemModel
{
    Logger:LoggerModel;
}