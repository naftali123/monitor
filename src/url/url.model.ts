import { ActivityHistory } from "./activityHistory.model";
export class Url {
    constructor(
        public label: string,
        public url: string,
        public tags: string[],
        public active: boolean,
        public frequency: number,
        public activityHistory: ActivityHistory[]
    ) {};
}