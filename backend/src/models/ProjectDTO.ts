export interface ProjectDTO {
	id: number,
    title: string,
    description: string,
    aim: string,
    funding: number,
    funding_motive: string,
    status: number,
    progress: number,
    topic_id: number,
    topic_title: string,
    team_name: string,
    leader_id: number,
    createDate: Date
}