import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';
import { JwChartComponent, JwChartParameter } from '../jw-chart/jw-chart.component';
import { JwObservatoryComponent } from '../jw-observatory/jw-observatory.component';
import * as moment from 'moment';
import * as moji from 'moji';

const KEY_OBSERVATORY_LIST = 'KEY_JW_OBSERVATORY_LIST';

@Component({
  selector: 'app-jw-observatory-list-page',
  templateUrl: './jw-observatory-list-page.component.html',
  styleUrls: ['./jw-observatory-list-page.component.css']
})
export class JwObservatoryListPageComponent implements OnInit {

  observatoryList: {[key:string]:string[]};
  prefectures: string[] = [];

  observatoryAutocompleteDict: {[key: string]: string[]} = {};

  selectedObservatories: string[] = [];
  loadedObservatoryInfo: {[key:string]:Observatory} = {};

  yesterday = null;

  myControl: FormControl = new FormControl();

  places = [];
  /*
  options = [
    'One',
    'Two',
    'Three'
  ];*/
  filteredOptions: Observable<string[]>;

  constructor(private httpService: JwHttpService,public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.yesterday = moment().subtract(1,'days');

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

    // https://www.tam-tam.co.jp/tipsnote/javascript/post5978.html
    const list = JSON.parse(localStorage.getItem(KEY_OBSERVATORY_LIST));

    if (list) {
      this.selectedObservatories = list;
    }

    this.download_observatories();
  }

  filter(val: string): string[] {
    return this.places.filter( place => {
      return this.observatoryAutocompleteDict[place].some((v,i,a) => {
        return v.includes(val);
      });
    });
//    return this.options.filter(option =>
//      option.toLowerCase().includes(val.toLowerCase()));
  }

  download_observatories() {
    //console.log('さあ、どうだ');

    this.httpService.getObservatoryList( (data) => {
      this.observatoryList = data;
      for(let key in this.observatoryList) {
        this.prefectures.push(key);
      }
    });

    this.httpService.getObservatoryAutocompleteDict((data) => {
      //this.observatoryAutocompleteDict = data;
      this.places = [];
      for(let key in data) {
  
        // https://www.npmjs.com/package/moji
        const zen_kata = moji(data[key]).convert('HK','ZK').toString();
  
        const zen_hira = moji(zen_kata).convert('KK','HG').toString();
  
        const arr = [];
        arr.push(key);
        arr.push( data[key]);
        arr.push(zen_kata);
        arr.push(zen_hira);
//        console.log(arr);
        this.observatoryAutocompleteDict[key] = arr;
        this.places.push(key);
      }
    });
  }

  objectKeys(obj) {
    return Object.keys(obj);
  }

  showSnackBar(msg: string): void {
      this.snackBar.open(msg,null, {
        duration: 2000,
      });
  }

  subItemClicked(placeName) {
    console.log('clicked: ' + placeName);

    if(this.selectedObservatories.includes(placeName)) {
      this.showSnackBar(placeName + ' は既に登録されています');
      console.log('すでに登録済み');
    } else {
      this.showSnackBar(placeName + ' を追加しました');
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

      this.showSnackBar(observatory_name + ' を削除しました');
    }
  }

  sortByName(): void {
    this.selectedObservatories.sort((a, b) => {
      const a1 = this.loadedObservatoryInfo[a].kana;
      const b1 = this.loadedObservatoryInfo[b].kana;

      if (a1 < b1) {
        return -1;
      } else if (a1 > b1) {
        return 1;
      }
      return 0;
    });
  }

  sortByLatitudeN(): void {
    this.selectedObservatories.sort((a, b) => {
      const a1 = JwObservatoryComponent.getDEGfromDMM(parseFloat(this.loadedObservatoryInfo[a].latitude),parseFloat(this.loadedObservatoryInfo[a].latitude_min));
      const b1 = JwObservatoryComponent.getDEGfromDMM(parseFloat(this.loadedObservatoryInfo[b].latitude),parseFloat(this.loadedObservatoryInfo[b].latitude_min));

      if (a1 < b1) {
        return 1;
      } else if (a1 > b1) {
        return -1;
      }
      return 0;
    });
  }

  sortByLatitudeS(): void {
    this.selectedObservatories.sort((a, b) => {
      const a1 = JwObservatoryComponent.getDEGfromDMM(parseFloat(this.loadedObservatoryInfo[a].latitude),parseFloat(this.loadedObservatoryInfo[a].latitude_min));
      const b1 = JwObservatoryComponent.getDEGfromDMM(parseFloat(this.loadedObservatoryInfo[b].latitude),parseFloat(this.loadedObservatoryInfo[b].latitude_min));

      if (a1 < b1) {
        return -1;
      } else if (a1 > b1) {
        return 1;
      }
      return 0;
    });
  }

  onLoaded(info:Observatory): void {
    // console.log(info.kana + ' loaded!');
    this.loadedObservatoryInfo[info.place] = info;
  }
}
