import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Second } from 'src/constants';
import { ActivityHistory } from './activityHistory.model';
import { Url } from './url.model';

@Injectable()
export class UrlCheckerService {
    constructor(private eventEmitter: EventEmitter2) {}
    private async checkUrl(url: string): Promise<ActivityHistory> {
        console.log('checkUrl:', url);
        const startTime = Date.now();
        try {
            const response = await fetch(url);
            if ([200, 404].includes(response.status)) {
                return new ActivityHistory(true, new Date(), 'ok', Date.now() - startTime);
            } else {
                try {
                    const parsedResponse = await response.json();
                    return new ActivityHistory(false, new Date(), `status: ${parsedResponse.status}, statusText: ${parsedResponse.statusText}, body: ${parsedResponse.body}`, Date.now() - startTime);
                }
                catch (error) {
                    return new ActivityHistory(false, new Date(), `status: ${response.status}, statusText: ${response.statusText}, body: ${response.body}`, Date.now() - startTime);
                }
            }
        }
        catch (error) {
            return new ActivityHistory(false, new Date(), error?.cause?.message ?? error.message, Date.now() - startTime);
        }
    }

    private async checkUrlAndUpdate(url: Url): Promise<void> {
        const activityHistory = await this.checkUrl(url.url);
        url.active = activityHistory.active;
        url.activityHistory.push(activityHistory);
        if(!url.active){
            console.log('activityHistory:', activityHistory);
        }
    }

    startMonitoring(url: Url): void {
        console.log('start url monitoring');
        url.intervalId = setInterval(async () => {
            await this.checkUrlAndUpdate(url);
            this.eventEmitter.emit('activityHistory.updated',url);
        }, url.frequency * Second);
    }

    stopMonitoring(url: Url): void {
        console.log('stop url monitoring');
        clearInterval(url.intervalId);
    }
}

