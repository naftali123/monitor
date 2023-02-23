import { Injectable } from '@nestjs/common';
import { cloneDeep, remove } from 'lodash';
import { ActivityHistory } from '../url/activityHistory.model';
import { Url } from '../url/url.model';
import { AddUrlRequest } from './types';
import { UrlCheckerService } from 'src/url/url-checker.service';
import { Second } from 'src/constants';
// This module is responsible for monitoring list of urls
// The urls is storing in the module
// The format of the store is as specified in url.model.ts 
// The module will check the urls every x minutes
// If the url is not responding, the module will store the reason (if is there some information about the reason) in local class data structure
// The module will also send a notification to the user (email, sms, etc) about the problem with the url (if the user is subscribed to the url)

@Injectable()
export class MonitorService {
  toProceed: Url[] = [];

  inProcess: Url[] = [];

  urls = (): Url[] => [...this.toProceed, ...this.inProcess];

  static monitorStarted: boolean = false;

  constructor(private readonly urlCheckerService: UrlCheckerService) {
    if(!MonitorService.monitorStarted) {
      this.startMonitoring();
      MonitorService.monitorStarted = true;
    }
  }

  noIntervalId(url: Url){
    return {...url, intervalId: undefined};
  }

  getAllUrls(): Url[] {
    console.log('getSubscriptions');
    return cloneDeep(this.urls());
  }

  getActiveUrls(): Url[] {
    console.log('getActiveUrls');
    return cloneDeep(this.urls().filter((url) => url.active));
  }

  getInactiveUrls(): Url[] {
    console.log('getInactiveUrls');
    return cloneDeep(this.urls().filter((url) => !url.active));
  }

  getActivityHistoryForLabel(label: string): ActivityHistory[] {
    console.log('getActivityHistoryForLabel');
    const urls = this.urls();
    const index = urls.findIndex((urlObj) => urlObj.label === label);
    if(index === -1) {
      return [];
    }
    return cloneDeep(urls[index].activityHistory);
  }

  //TODO: It will also send a notification to the user (email, sms, etc) about the subscription
  addUrl({ url, label, frequency = 1 }: AddUrlRequest): Url | string {
    console.log('addUrl');
    const foundToProceed = this.toProceed.some((urlObj) => urlObj.url === url);
    const foundInProcess = this.inProcess.some((urlObj) => urlObj.url === url);
    if(!foundToProceed && !foundInProcess) {
      const newUrl = new Url(label, url, [], true, frequency, []);
      this.toProceed.push(newUrl);
      console.log('newUrl:', newUrl);
      return newUrl;
    }
    else if(foundToProceed) {}
    else return `The url ${url} is already subscribed`;
  }

  addUrlHelp(): string {
    console.log('subscribeToUrlHelper');
    return 'subscribeToUrl: \n' +
      'This method will be called when the user is subscribing to urls \n' +
      'the argument is: \n' +
      'url: string - the url to subscribe to \n' +
      'label: string - the label of the url \n' +
      'frequency: number - the frequency of the url checking \n' +
      'tags: string[] - the tags of the url (optional), can be use for grouping urls \n'
    ;
  }
  // This method will be called when the user is subscribing to the list of urls
  addUrlList(urls: AddUrlRequest[]): (Url | string)[] {
    console.log('subscribeToUrlList');
    return urls.map((url) => this.addUrl(url));
  }

  addUrlListHelp(): string {
    console.log('subscribeToUrlListHelper');
    return 'subscribeToUrlList: \n' +
      'This method will be called when the user is subscribing to the list of urls \n' +
      'the argument is: \n' +
      'urls: SubscribeToUrl[] - the list of urls to subscribe to \n' +
      'SubscribeToUrl: \n' +
      'url: string - the url to subscribe to \n' +
      'label: string - the label of the url \n' +
      'frequency: number - the frequency of the url checking \n' +
      'tags: string[] - the tags of the url (optional), can be use for grouping urls \n'
    ;
  }

  // Will remove the url from the list of urls
  //TODO: It will also send a notification to the user (email, sms, etc) about the unsubscription
  removeUrl(url: string): string {
    console.log('removeUrl');
    this.inProcess.forEach((urlObj) => {
      if(urlObj.url ===  url) {
        this.urlCheckerService.stopMonitoring(urlObj);
      }
    });
    remove(this.toProceed, { url });
    remove(this.inProcess, { url });
    return url;
  }
  
  removeUrlList(urls: string[]): string[] {
    console.log('unsubscribeFromUrlList');
    urls.forEach((url) => this.removeUrl(url));
    return urls;
  }

  removeUrlsByTags(tags: string[]): string[] {
    console.log('unsubscribeToTags');
    
    remove(this.toProceed, (url) => {
      const urlTags = url.tags;
      return urlTags.some((tag: string) => tags.includes(tag));
    });
    
    remove(this.inProcess, (url) => {
      const urlTags = url.tags;
      return urlTags.some((tag: string) => tags.includes(tag));
    });

    return tags;
  }

  // It will check the list of urls
  // If the url is not responding, it will store the reason (if is there some information about the reason) in local class data structure
  //TODO: It will also send a notification to the user (email, sms, etc) about the problem with the url (if the user is subscribed to the url)
  checkUrls(): void {
    console.log('checkUrls');
    this.toProceed.forEach((urlObj) => {
      this.toProceed = this.toProceed.filter((url) => url.url !== urlObj.url);
      this.inProcess.push(urlObj);
      this.urlCheckerService.startMonitoring(urlObj);
    });
  }

  startMonitoring(): void {
    console.log('startMonitoring');
    setInterval(() => {
      this.checkUrls();
    }, Second);
  }
}
