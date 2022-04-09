import { ICuteUser } from "./ICuteUser";

export interface ICuteGroup {
    id: number;
    groupMembers: Array<ICuteUser>;
}
