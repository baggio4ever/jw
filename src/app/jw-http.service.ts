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

    console.log(params.toString());

    this.http.get( this.base_url + 'highest_top', { params: params }).subscribe(data => {
        callback(data['Items'] as TemperatureData[]);
    });
  }

}

export interface TemperatureData {
  place: string;
  date: string;
  time: string;
  temperature: string;
}
