export interface ITopic {
	id?: number,
    title: string,
    parent_id: number | null,
    class?: string
    children? : ITopic[]
}