import { Injectable } from '@nestjs/common';
import { Second } from 'src/consts';
import { ActivityHistory } from './activityHistory.model';
import { Url } from './url.model';

@Injectable()
export class UrlCheckerService {
    
    inProcess: string[] = [];

    private async checkUrl(url: string): Promise<ActivityHistory> {
        console.log('checkUrl:', url);
        try {
            const response = await fetch(url);
            if ([200, 404].includes(response.status)) {
                return new ActivityHistory(true, new Date(), 'ok');
            } else {
                try {
                    const parsedResponse = await response.json();
                    return new ActivityHistory(false, new Date(), `status: ${parsedResponse.status}, statusText: ${parsedResponse.statusText}, body: ${parsedResponse.body}`);
                }
                catch (error) {
                    return new ActivityHistory(false, new Date(), `status: ${response.status}, statusText: ${response.statusText}, body: ${response.body}`);
                }
            }
        }
        catch (error) {
            return new ActivityHistory(false, new Date(), error?.cause?.message ?? error.message);
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
        setInterval(() => {
            this.checkUrlAndUpdate(url);
        }, Second * url.frequency);
    }

}

