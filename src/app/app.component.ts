import { Component, OnInit, AfterViewInit, AfterViewChecked, Inject, ViewChild, VERSION } from '@angular/core';
import { JwHttpService, TemperatureData, Observatory } from './jw-http.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
import { JwChartComponent } from './jw-chart/jw-chart.component';

const KEY_BASE_URL = 'KEY_JW_BASE_URL';



// https://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
/**
 * 日付をフォーマットする
 * @param  {Date}   date     日付
 * @param  {String} [format] フォーマット
 * @return {String}          フォーマット済み日付
 */
/*var formatDate = function (date, format) {
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
*/
/**
 * 数日前を返す
 * @param  {Date}   date     日付
 * @param  {Number} daysAgo  n日前
 * @return {Date}          dateからdaysAgo前の日付
 */
/*var getDateBefore = function(date, daysAgo) {
  var d = new Date(date);
  d.setDate(d.getDate()-daysAgo);

  return d;
}

var getYesterday = function() {
  const d = Date.now();
  return getDateBefore(d,1);
}
*/

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, AfterViewChecked, OnInit {

  base_url = '';

  constructor(private httpService: JwHttpService) {
  }

  ngOnInit() {
    console.log('ngOnInit()');

    this.base_url = localStorage.getItem(KEY_BASE_URL);
    this.httpService.setBaseURL(this.base_url);
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

  applyBaseUrl(): void {
    console.log(this.base_url);

    localStorage.setItem(KEY_BASE_URL, this.base_url);
    this.httpService.setBaseURL(this.base_url);
  }
}
