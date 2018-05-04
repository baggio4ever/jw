import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class JwHttpService {

  base_url = '';

  constructor(private http: HttpClient) { }

  setBaseURL(url: string): void {
    this.base_url = url;
  }

  getBaseURL(): string {
    return this.base_url;
  }

  getHighestTop( date: string,top: number, callback: (data: TemperatureData[]) => void): void {
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('date', date ).set('top', top.toString());

    console.log( date + 'の最高気温トップ' + top.toString());

    this.http.get( this.base_url + 'highest_top', { params: params }).subscribe(data => {
        callback(data['Items'] as TemperatureData[]);
    });
  }

  getLowestTop( date: string,top: number, callback: (data: TemperatureData[]) => void): void {
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('date', date ).set('top', top.toString());

    console.log( date + 'の最低気温トップ' + top.toString());

    this.http.get( this.base_url + 'lowest_top', { params: params }).subscribe(data => {
        callback(data['Items'] as TemperatureData[]);
    });
  }

  getRain24hTop( date: string,top: number, callback: (data: RainfallData[]) => void): void {
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('date', date ).set('top', top.toString());

    console.log( date + 'の降水量（24h）トップ' + top.toString());

    this.http.get( this.base_url + 'rain24h_top', { params: params }).subscribe(data => {
        callback(data['Items'] as RainfallData[]);
    });
  }
  
  getSnowTop( date: string,top: number, callback: (data: SnowData[]) => void): void {
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('date', date ).set('top', top.toString());

    console.log( date + 'の積雪量トップ' + top.toString());

    this.http.get( this.base_url + 'snow_top', { params: params }).subscribe(data => {
        callback(data['Items'] as SnowData[]);
    });
  }
  
}

export interface TemperatureData {
  place: string;
  date: string;
  time: string;
  temperature: string;
}

export interface RainfallData {
  place: string;
  date: string;
  time: string;
  rainfall_amount: string;
}

export interface SnowData {
  place: string;
  date: string;
  time: string;
  snow_depth: string;
}
