import { Component, OnInit } from '@angular/core';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';

@Component({
  selector: 'app-jw-observatory-list-page',
  templateUrl: './jw-observatory-list-page.component.html',
  styleUrls: ['./jw-observatory-list-page.component.css']
})
export class JwObservatoryListPageComponent implements OnInit {

  prefectures: string[] = [];

  constructor(private httpService: JwHttpService) { }

  ngOnInit() {
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
}
