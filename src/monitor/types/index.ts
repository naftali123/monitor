export type AddUrlRequest = {
    url: string,
    label: string,
    frequency?: number,
    tags?: string[],
}

export type RemoveUrlRequest = {
    url: string,
}

export type TagsRequest = {
    tags: string[],
}