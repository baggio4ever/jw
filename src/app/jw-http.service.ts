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
  

  buildRangeParams(place: string, date_from: string, date_to: string) {
    // Parameters obj-
    const params: HttpParams = new HttpParams().set('place', place ).set('from', date_from).set('to',date_to);

    return params;
  }

  getHighestRange( place: string, date_from: string, date_to: string, callback: (data: TemperatureData[]) => void): void {
    // Parameters obj-
    //const params: HttpParams = new HttpParams().set('place', place ).set('from', //date_from).set('to',date_to);

    console.log( place + 'の最高気温 ' + date_from + ' - ' + date_to);

    this.http.get( this.base_url + 'highest_range', { params: this.buildRangeParams(place,date_from,date_to) /*params*/ }).subscribe(data => {
        callback(data['Items'] as TemperatureData[]);
    });
  }

  getLowestRange( place: string, date_from: string, date_to: string, callback: (data: TemperatureData[]) => void): void {
    // Parameters obj-
    //const params: HttpParams = new HttpParams().set('place', place ).set('from', //date_from).set('to',date_to);

    console.log( place + 'の最低気温 ' + date_from + ' - ' + date_to);

    this.http.get( this.base_url + 'lowest_range', { params: this.buildRangeParams(place,date_from,date_to) /*params*/ }).subscribe(data => {
        callback(data['Items'] as TemperatureData[]);
    });
  }

  getRain24hRange( place: string, date_from: string, date_to: string, callback: (data: RainfallData[]) => void): void {

    console.log( place + 'の降水量(24h) ' + date_from + ' - ' + date_to);

    this.http.get( this.base_url + 'rain24h_range', { params: this.buildRangeParams(place,date_from,date_to) }).subscribe(data => {
        callback(data['Items'] as RainfallData[]);
    });
  }

  getSnowRange( place: string, date_from: string, date_to: string, callback: (data: SnowData[]) => void): void {

    console.log( place + 'の積雪量 ' + date_from + ' - ' + date_to);

    this.http.get( this.base_url + 'snow_range', { params: this.buildRangeParams(place,date_from,date_to) }).subscribe(data => {
        callback(data['Items'] as SnowData[]);
    });
  }

  getObservatory( place: string, callback: (data: Observatory) => void): void {

    console.log( place + 'の詳細');

    const params: HttpParams = new HttpParams().set('name', place );

    this.http.get( this.base_url + 'observatory', { params: params }).subscribe(data => {
        callback(data['Items'][0] as Observatory);
    });
  }

  getObservatoryList( callback: (data:{[key:string]:string[]}) => void ): void {
    const fn = '../assets/observatory_tree.json';
    this.http.get(fn, { responseType: 'json' }).subscribe(data => {
      callback(data as {[key:string]:string[]});
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

export interface Observatory {
  place: string;
  kana: string;
  address: string;
  latitude: string;
  latitude_min: string;
  longitude: string;
  longitude_min: string;
  place_no: string;
  prefecture: string;
  type: string;
}