import { RequestStatus } from "./RequestStatus"

export interface IProject {
	id?: number,
    title?: string,
    description?: string,
    aim?: string,
    funding?: number,
    funding_motive?: string,
    status: number,
    progress: number,
    topic_id: number,
    topic_title?: string,
    team_id?: number,
    team_name?: string,
    leader_id?: number,
    applic_id: number | -1,
    applic_status: RequestStatus | -1,
    createDate: Date
}