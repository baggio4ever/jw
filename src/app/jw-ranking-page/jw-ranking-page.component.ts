import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';
import { JwChartComponent, JwChartParameter } from '../jw-chart/jw-chart.component';

const TOP_X = 10;


/***
 * こっちでデータを取得しやるよりも、コンポーネントに 場所、期間を指定してコンポーネント側でデータ取得から表示までさせた方が良い気がする
 */

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
  selector: 'app-jw-ranking-page',
  templateUrl: './jw-ranking-page.component.html',
  styleUrls: ['./jw-ranking-page.component.css']
})
export class JwRankingPageComponent implements OnInit {

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

  // observatory_info: Observatory;
  observatory_name: string;

  yesterday = null;

  @ViewChild('jwChart1') jwChart1:JwChartComponent;

  constructor(private httpService: JwHttpService) {
  }

  ngOnInit() {
    console.log('ngOnInit()');

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

  getDetail(place: string): void {
    //this.observatory_info = null;
    this.observatory_name = place;
    this.clearRanges();
/*
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
*/
/*
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
  */
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

      // console.log('doParse!');

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

      // console.log('labels: ' + labels)

//      this.jwChart1.labels = labels;
//      this.jwChart1.highest = h_vals;
//      this.jwChart1.lowest = l_vals;
//      this.jwChart1.rain24h = r_vals;

//      this.jwChart1.update();

    }, 0);
  }


  hasReceived(): boolean {
  /*
    if (this.observatory_info === null) {
      return false;
    }
*/
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

  getChartParam():JwChartParameter {
    return {
      observatory_name: this.observatory_name,
      end_date: this.yesterday.format('YYYY/MM/DD'),
      span: 14
    };
  }

}
