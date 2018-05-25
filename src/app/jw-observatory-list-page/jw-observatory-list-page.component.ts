import { Component, OnInit } from '@angular/core';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';
import { JwChartComponent, JwChartParameter } from '../jw-chart/jw-chart.component';
import * as moment from 'moment';

const KEY_OBSERVATORY_LIST = 'KEY_JW_OBSERVATORY_LIST';

@Component({
  selector: 'app-jw-observatory-list-page',
  templateUrl: './jw-observatory-list-page.component.html',
  styleUrls: ['./jw-observatory-list-page.component.css']
})
export class JwObservatoryListPageComponent implements OnInit {

  observatoryList: {[key:string]:string[]};
  prefectures: string[] = [];

  selectedObservatories: string[] = [];
  loadedObservatoryInfo: {[key:string]:Observatory} = {};

  yesterday = null;

  constructor(private httpService: JwHttpService) { }

  ngOnInit() {
    this.yesterday = moment().subtract(1,'days');

    // https://www.tam-tam.co.jp/tipsnote/javascript/post5978.html
    const list = JSON.parse(localStorage.getItem(KEY_OBSERVATORY_LIST));

    if (list) {
      this.selectedObservatories = list;
    }

    this.download_observatories();
  }

  download_observatories() {
    console.log('さあ、どうだ');

    this.httpService.getObservatoryList( (data) => {
      //console.log('----- json -----');
      this.observatoryList = data;
      for(let key in this.observatoryList) {
        this.prefectures.push(key);
      }
    });
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  subItemClicked(placeName) {
    console.log('clicked: ' + placeName);

    if(this.selectedObservatories.includes(placeName)) {
      console.log('すでに登録済み');
    } else {
      console.log('お初にお目にかかります');
      this.selectedObservatories.push(placeName);
      localStorage.setItem(KEY_OBSERVATORY_LIST, JSON.stringify(this.selectedObservatories));
    }
  }

  getChartParam(observatory_name: string):JwChartParameter {
    return {
      observatory_name: observatory_name,
      end_date: this.yesterday.format('YYYY/MM/DD'),
      span: 14
    };
  }

  deleteItem(observatory_name: string): void {
    const index = this.selectedObservatories.indexOf(observatory_name);
    if(index>=0){
      this.selectedObservatories.splice(index,1);
      localStorage.setItem(KEY_OBSERVATORY_LIST, JSON.stringify(this.selectedObservatories));
    }
  }

  sortByName(): void {
    this.selectedObservatories.sort((a,b) => {
      const a1 = this.loadedObservatoryInfo[a].kana;
      const b1 = this.loadedObservatoryInfo[b].kana;
      if(a1 < b1){
        return -1;
    }else if(a1 > b1){
        return 1;
    }
    return 0;
    });
  }

  sortByLatitudeN(): void {

  }

  sortByLatitudeS(): void {

  }

  onLoaded(info:Observatory): void {
    // console.log(info.kana + ' loaded!');
    this.loadedObservatoryInfo[info.place] = info;
  }
}
