import { Injectable } from '@nestjs/common';
import { cloneDeep, remove } from 'lodash';
import { ActivityHistory } from '../url/activityHistory.model';
import { Url } from '../url/url.model';
import { SubscribeToUrl } from './types';
import { UrlCheckerService } from 'src/url/url-checker.service';
import { Second } from 'src/consts';
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

  constructor(private readonly urlCheckerService: UrlCheckerService) {
    this.startMonitoring();  
  }

  getUrls(): Url[] {
    console.log('getUrls');
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

  getActivityHistory(label: string): ActivityHistory[] {
    console.log('getActivityHistory');
    const urls = this.urls();
    const index = urls.findIndex((urlObj) => urlObj.label === label);
    if(index === -1) {
      return [];
    }
    return cloneDeep(urls[index].activityHistory);
  }

  // It will also send a notification to the user (email, sms, etc) about the subscription
  subscribeToUrl({ url, label, frequency = 1 }: SubscribeToUrl): void {
    console.log('subscribeToUrl');
    const foundToProceed = this.toProceed.some((urlObj) => urlObj.url === url);
    const foundInProcess = this.inProcess.some((urlObj) => urlObj.url === url);
    if(!foundToProceed && !foundInProcess) {
      this.toProceed.push(new Url(label, url, [], false, frequency, []));
      console.log('url:', this.urls[0]);
    }
    else if(foundToProceed) {}
  }

  subscribeToUrlHelper(): string {
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
  subscribeToUrlList(urls: SubscribeToUrl[]): void {
    console.log('subscribeToUrlList');
    urls.forEach((url) => this.subscribeToUrl(url));
  }

  subscribeToUrlListHelper(): string {
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
  // It will also send a notification to the user (email, sms, etc) about the unsubscription
  unsubscribeFromUrl(url: string): void {
    console.log('unsubscribeFromUrl');
   
    remove(this.toProceed, { url });
    // TODO: turn off monitoring for this url
    remove(this.inProcess, { url });
  }
  
  unsubscribeFromUrlList(urls: string[]): void {
    console.log('unsubscribeFromUrlList');
    urls.forEach((url) => this.unsubscribeFromUrl(url));
  }

  unsubscribeToTags(tags: string[]): void {
    console.log('unsubscribeToTags');
    
    remove(this.toProceed, (url) => {
      const urlTags = url.tags;
      return urlTags.some((tag: string) => tags.includes(tag));
    });
    
    remove(this.inProcess, (url) => {
      const urlTags = url.tags;
      return urlTags.some((tag: string) => tags.includes(tag));
    });
  }

  // It will check the list of urls
  // If the url is not responding, it will store the reason (if is there some information about the reason) in local class data structure
  // It will also send a notification to the user (email, sms, etc) about the problem with the url (if the user is subscribed to the url)
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
