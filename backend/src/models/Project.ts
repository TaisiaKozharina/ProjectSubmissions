export interface IProject {
	id?: number,
    title?: string,
    description?: string,
    aim?: string,
    funding?: number,
    funding_motive?: string,
    deadline?: Date,
    status?: number,
    topic_id?: number
}