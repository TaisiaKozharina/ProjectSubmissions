import { RequestStatus } from "./RequestStatus";

export interface IApplication {
    a_id: number,
    a_status: RequestStatus,
    a_createDate: Date
	p_id: number,
    p_title: string,
    p_description: string,
    p_aim: string,
    p_funding: number,
    p_funding_motive: string,
    p_progress: number,
    p_createDate: Date,
    topic_title: string,
    leader_name: string,
    members: number //count
}