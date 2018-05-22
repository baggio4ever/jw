import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';

@Component({
  selector: 'app-jw-observatory',
  templateUrl: './jw-observatory.component.html',
  styleUrls: ['./jw-observatory.component.css']
})
export class JwObservatoryComponent implements OnInit {

  private _name: string;
  observatory_info: Observatory;

  @Input()
  set observatory_name( name: string ) {
    this._name = name;

    if (this._name) {
      this.httpService.getObservatory(
        this._name,
        data => {
          this.observatory_info = data;
        }
      );
    }
  }

  constructor(private httpService: JwHttpService) { }

  ngOnInit() {
  }

  getType( t: string ): string {
    let ret = '-';

    switch (t) {
      case '官':
        ret = '気象官署';
        break;
      case '四':
        ret = '四要素観測所';
        break;
      case '三':
        ret = '三要素観測所';
        break;
      case '雨':
        ret = '雨量観測所';
        break;
      default:
        break;
    }
    return ret;
  }

  // http://www.shurey.com/html/googlemaps.html
  getGmapUrl(): string {
    if (this.observatory_info) {
      // 緯度
      const latitude = parseFloat(this.observatory_info.latitude) + parseFloat(this.observatory_info.latitude_min) / 60.0;
      // 経度
      const longitude = parseFloat(this.observatory_info.longitude) + parseFloat(this.observatory_info.longitude_min) / 60.0;

      // return 'http://maps.google.co.jp/maps?ll=35.004212,135.869105';
      return 'http://maps.google.co.jp/maps?ll=' + latitude + ',' + longitude + '&z=16';
    } else {
      return '#';
    }
  }
}
