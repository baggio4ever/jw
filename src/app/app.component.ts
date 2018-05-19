import { Component, OnInit, AfterViewInit, AfterViewChecked, Inject, ViewChild, VERSION } from '@angular/core';
import { JwHttpService, TemperatureData, Observatory } from './jw-http.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
import { JwChartComponent } from './jw-chart/jw-chart.component';

const KEY_BASE_URL = 'KEY_JW_BASE_URL';

const TOP_X = 10;


// https://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
/**
 * 日付をフォーマットする
 * @param  {Date}   date     日付
 * @param  {String} [format] フォーマット
 * @return {String}          フォーマット済み日付
 */
var formatDate = function (date, format) {
  if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  if (format.match(/S/g)) {
    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
    var length = format.match(/S/g).length;
    for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
  }
  return format;
};

/**
 * 数日前を返す
 * @param  {Date}   date     日付
 * @param  {Number} daysAgo  n日前
 * @return {Date}          dateからdaysAgo前の日付
 */
var getDateBefore = function(date, daysAgo) {
  var d = new Date(date);
  d.setDate(d.getDate()-daysAgo);

  return d;
}

var getYesterday = function() {
  const d = Date.now();
  return getDateBefore(d,1);
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, AfterViewChecked, OnInit {

  angular_version = VERSION;

  base_url = '';
  date_to_search = new FormControl(new Date());
  date_range = new FormControl(new Date());
  place = '';

  placeX = '';
  observatory_info: Observatory;

  highest_top = [];
  lowest_top = [];
  rain24h_top = [];
  snow_top = [];

  highest_range_received = false;
  highest_range = [];
  lowest_range_received = false;
  lowest_range = [];
  rain24h_range_received = false;
  rain24h_range = [];
  // snow_range = [];

  yesterday = null;

  prefectures: string[] = [];

  @ViewChild('jwChart1') jwChart1:JwChartComponent;

  constructor(private httpService: JwHttpService) {
  }

  ngOnInit() {
    console.log('ngOnInit()');

    this.base_url = localStorage.getItem(KEY_BASE_URL);
    this.httpService.setBaseURL(this.base_url);

    this.yesterday = moment(getYesterday());

    const formatted_d = this.yesterday.format('YYYY/MM/DD');

    this.httpService.getHighestTop(
      formatted_d,
      TOP_X,
      data => {
        console.log(data);
        this.highest_top = data;
      }
    );

    this.httpService.getLowestTop(
      formatted_d,
      TOP_X,
      data => {
        console.log(data);
        this.lowest_top = data;
      }
    );

    this.httpService.getRain24hTop(
      formatted_d,
      TOP_X,
      data => {
        console.log(data);
        this.rain24h_top = data;
      }
    );

  }

  ngAfterViewInit() {
    console.log('ngViewInit()');

  }

  ngAfterViewChecked() {
    //    console.log('AfterViewChecked');
  }

  onChanged(fileVal) {
    console.log('onChanged: ' + fileVal.name);
  }

  getDetail(place: string): void {
    this.observatory_info = null;
    this.clearRanges();

    const date_to = this.yesterday.format('YYYY/MM/DD');
    const date_from = this.yesterday.clone().subtract(13,'days').format('YYYY/MM/DD'); // 2週間分

    const days: string[] = [];
    const m = this.yesterday.clone().subtract(13,'days');
    for(let i=0;i<=13;i++) {
      days.push( m.format('YYYY/MM/DD'));
      m.add(1,'days');
    }
    console.log('days: ' + days );

    this.httpService.getHighestRange(
      place,
      date_from,
      date_to,
      data => {
        console.log(data);
        this.highest_range_received = true;
        this.highest_range = data;

        if (this.hasReceived()) {
          this.doParse(days);
        }
      }
    );

    this.httpService.getLowestRange(
      place,
      date_from,
      date_to,
      data => {
        console.log(data);
        this.lowest_range_received = true;
        this.lowest_range = data;

        if (this.hasReceived()) {
          this.doParse(days);
        }
      }
    );

    this.httpService.getRain24hRange(
      place,
      date_from,
      date_to,
      data => {
        console.log(data);
        this.rain24h_range_received = true;
        this.rain24h_range = data;

        if (this.hasReceived()) {
          this.doParse(days);
        }
      }
    );


    this.httpService.getObservatory(
      place,
      data => {
        this.observatory_info = data;
        console.log(this.observatory_info);

        if (this.hasReceived()) {
          this.doParse(days);
        }
      }
    );
  }
/*
  clearTops() {
    this.highest_top = [];
    this.lowest_top = [];
    this.rain24h_top = [];
    this.snow_top = [];
  }
*/
  clearRanges() {
    this.highest_range_received = false;
    this.lowest_range_received = false;
    this.rain24h_range_received = false;

    this.highest_range = [];
    this.lowest_range = [];
    this.rain24h_range = [];
    // this.snow_range = [];
  }

  doParse(days: string[]): void {
    setTimeout( () => {
      const labels = [];
      const h_vals = [];
      const l_vals = [];
      const r_vals = [];

      console.log('doParse!');

      for (let i=0;i<days.length; i++) {
        const dd = days[i].split('/');  // YYYY/MM/DD を M/D の形に変換
        const l = parseInt(dd[1],10) + '/' + parseInt(dd[2],10);
        labels.push( l );
      }
      for (let i = 0; i < this.highest_range.length; i++) {
        const v = this.highest_range[i];
        h_vals.push( parseFloat( v.temperature ));
      }
      for (let i = 0; i < this.lowest_range.length; i++) {
        const v = this.lowest_range[i];
        l_vals.push( parseFloat( v.temperature ));
      }
      for (let i = 0; i < this.rain24h_range.length; i++) {
        const v = this.rain24h_range[i];
        r_vals.push( parseFloat( v.rainfall_amount ));
      }

      console.log('labels: ' + labels)

      this.jwChart1.labels = labels;
      this.jwChart1.highest = h_vals;
      this.jwChart1.lowest = l_vals;
      this.jwChart1.rain24h = r_vals;
//      this.jwChart1.update();

    }, 0);
  }


  hasReceived(): boolean {
    if (this.observatory_info === null) {
      return false;
    }
    if (!this.highest_range_received) {
      return false;
    }
    if (!this.lowest_range_received) {
      return false;
    }
    if (!this.rain24h_range_received) {
      return false;
    }
    return true;
  }

  download_test() {
    console.log('さあ、どうだ');

    this.httpService.getObservatoryList( (data) => {
      //console.log('----- json -----');
      for(let key in data) {
        this.prefectures.push(key);
      }
    });
  }

  applyBaseUrl(): void {
    console.log(this.base_url);

    localStorage.setItem(KEY_BASE_URL, this.base_url);
    this.httpService.setBaseURL(this.base_url);
  }
}
