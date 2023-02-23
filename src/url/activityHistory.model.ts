export class ActivityHistory {
    constructor(
        public active: boolean,
        public date: Date,
        public info: string,
        public responseTime: number
    ) {};
}