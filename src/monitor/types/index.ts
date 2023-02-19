export type SubscribeToUrl = {
    url: string,
    label: string,
    frequency?: number,
    tags?: string[],
}

export type UnsubscribeToUrl = {
    url: string,
}

export type UnsubscribeToTags = {
    tags: string[],
}