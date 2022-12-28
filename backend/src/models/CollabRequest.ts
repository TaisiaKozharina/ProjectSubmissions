import { RequestStatus } from "./RequestStatus";

export interface CollabRequest {
	id: number;
    createDate: Date;
    message: string;
    prof_id: number;
    proj_title: string;
    status: RequestStatus;
    pers_id: number;
    pers_name: string;
    team_id: number;
    //[key: string]: any
}