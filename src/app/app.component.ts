import { Component, OnInit, AfterViewInit, AfterViewChecked, Inject, Sanitizer,VERSION } from '@angular/core';
import {JwHttpService,TemperatureData} from './jw-http.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {FormControl} from '@angular/forms';

const KEY_BASE_URL = 'KEY_JW_BASE_URL';


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

  yes() {
    console.log(this.date_to_search.value);

    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date
    const d = this.date_to_search.value;
    const formatted_d = formatDate(d,'YYYY/MM/DD')
    console.log('formated : '+ formatted_d);

    this.httpService.getHighestTop(
      formatted_d,
      5,
      data => {
        console.log(data);
      }
    );

    this.httpService.getLowestTop(
      formatted_d,
      5,
      data => {
        console.log(data);
      }
    );

    this.httpService.getRain24hTop(
      formatted_d,
      5,
      data => {
        console.log(data);
      }
    );

    this.httpService.getSnowTop(
      formatted_d,
      5,
      data => {
        console.log(data);
      }
    );
  }

  yes2() {
    console.log(this.date_range.value);

    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date
    const d = this.date_range.value;
    const formatted_d = formatDate(d,'YYYY/MM/DD')
    const d2 = getDateBefore(d,6);
    const formatted_d2 = formatDate(d2,'YYYY/MM/DD')
    console.log('formated : '+ formatted_d);

    this.httpService.getHighestRange(
      this.place,
      formatted_d2,
      formatted_d,
      data => {
        console.log(data);
      }
    );
  }

  applyBaseUrl(): void {
    console.log(this.base_url);

    localStorage.setItem(KEY_BASE_URL, this.base_url);
    this.httpService.setBaseURL(this.base_url);
  }
}
