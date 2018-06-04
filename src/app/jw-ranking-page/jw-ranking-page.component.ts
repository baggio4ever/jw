import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';
import { JwChartComponent, JwChartParameter } from '../jw-chart/jw-chart.component';

const TOP_X = 10;


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

  observatory_name: string;

  yesterday = null;

  @ViewChild('jwChart1') jwChart1:JwChartComponent;

  constructor(private httpService: JwHttpService) {
  }

  ngOnInit() {
    console.log('ngOnInit()');

    this.yesterday = moment().subtract(1,'days');

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

    this.observatory_name = place;
  }

  getChartParam(): JwChartParameter {
    return {
      observatory_name: this.observatory_name,
      end_date: this.yesterday.format('YYYY/MM/DD'),
      span: 14
    };
  }

}
