import { randomUUID } from "crypto";
import { ActivityHistory } from "./activityHistory.model";
export class Url {
    uuid: string
    constructor(
        public label: string,
        public url: string,
        public tags: string[],
        public active: boolean,
        public interval: number,
        public threshold: number,
        public activityHistory: ActivityHistory[],
        public intervalId?: NodeJS.Timeout
    ) {
        this.uuid = randomUUID();
    };
}