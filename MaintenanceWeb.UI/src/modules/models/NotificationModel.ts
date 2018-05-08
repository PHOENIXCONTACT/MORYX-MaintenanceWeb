import SerializableException from './SerializableException';
import { ModuleNotificationType } from './ModuleNotificationType';

export default class NotificationModel
{
    Timestamp : Date;
    Important : boolean;
    Exception : SerializableException;
    NotificationType : ModuleNotificationType;
}