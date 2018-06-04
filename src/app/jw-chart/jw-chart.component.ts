import { Component, Input, OnInit, AfterViewInit, AfterViewChecked, ViewChild } from '@angular/core';
import { JwHttpService, TemperatureData, Observatory } from '../jw-http.service';
import {Chart} from 'chart.js';
import * as moment from 'moment';

const DEFAULT_MAX_RAIN24H = 100;

export interface JwChartParameter {
  observatory_name: string;
  end_date: string;
  span: number;
}


@Component({
  selector: 'app-jw-chart',
  templateUrl: './jw-chart.component.html',
  styleUrls: ['./jw-chart.component.css']
})
export class JwChartComponent implements OnInit, AfterViewInit {
  
  context: CanvasRenderingContext2D;

  myChart = null;

  @ViewChild('myChart') myCanvas;

  private _caption: string = '';

  private _labels: string[] = [];
  private _highest = [];
  private _lowest = [];
  private _rain24h: number[] = [];

  private _name: string = '';
  private _end_date: string = '';
  private _span: number = 14;

  private _opened = false;

  @Input()
  set caption( caption:string ) {
    this._caption = caption;
    console.log('set caption');
    this.update();
  }

  @Input()
  set chart_param( param: JwChartParameter ) {
    let changed = false;

    if( this._name != param.observatory_name) {
      changed = true;
      this._name = param.observatory_name;
    }
    if( this._end_date != param.end_date ) {
      changed = true;
      this._end_date = param.end_date;
    }
    if( this._span != param.span ) {
      changed = true;
      this._span = param.span;
    }

    // 変化があったかどうかをチェックするようにしないと延々呼ばれるぽい
    // 年がら年中、このセッターって呼ばれているのかしら
    // 引数に変化があった時のみ呼ばれるのかと都合よく考えていたけど違うようだ
    if( this.myChart && this._opened && changed) {
      console.log('**** rebuild!! ****');
      this.rebuildChart();
    }
  }

  constructor(private httpService: JwHttpService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext('2d');

    this.myChart = new Chart(this.context, {
      type: 'bar',
      data: {
        labels: this._labels,
        datasets: [{
          type: 'line',
          label: '最高気温[℃]',
          data: this._highest,
          backgroundColor: 'rgba(255,10,10,0.2)',
          borderColor: 'rgba(255,10,10,0.5)',
          pointBackgroundColor: "rgba(255,10,10,0.2)",
          borderWidth: 2,
          fill: false,
          yAxisID: "y-axis-1",
        },
        {
          type: 'line',
          label: '最低気温[℃]',
          data: this._lowest,
          pointStyle: 'triangle',
          backgroundColor: 'rgba(10,10,255,0.2)',
          borderColor: 'rgba(10,10,255,0.5)',
          pointBackgroundColor: 'rgba(10,10,255,0.2)',
          borderWidth: 2,
          fill: false,
          yAxisID: "y-axis-1",
        },
        {
          type: 'bar',
          label: '24h降水量[mm]',
          data: this._rain24h,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: "y-axis-2",
        },
/*        {
          type: 'bar',
          label: '積雪量[cm]',
          data: this.snow,
          backgroundColor: 'rgba(50, 50, 50, 0.2)',
          borderColor: 'rgba(50, 50, 50, 1)',
          borderWidth: 1,
          yAxisID: "y-axis-2",
        }*/]
      },
      options: {
        responsive: false,
        title: {
          display: true,
          text: this._caption, //'XXX の　情報',
        },
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 20,
          }
        },
        scales: {
          yAxes: [{
            id: 'y-axis-1',   // Y軸のID
            type: 'linear',   // linear固定
            position: 'left', // どちら側に表示される軸か？
            ticks: {          // スケール
              max: 40,
              min: -20,
              stepSize: 10
            },
            scaleLabel: {
              display: true,
              labelString: '温度[℃]',
            },
//            gridLines: {
//              color: 'rgba(200,255,200,1)',
//            },
          }, {
            id: 'y-axis-2',
            type: 'linear',
            position: 'right',
            ticks: {
              max: this.getMaxRain24h(),
              min: 0,
              stepSize: 20
            },
            scaleLabel: {
              display: true,
              labelString: '降水量[mm]',
            },
            gridLines: {
//              color: 'rgba(200,200,255,1)',
              drawOnChartArea: false,
            },
          }],
        }
      }
    });

    this.rebuildChart();
    this._opened = true;
  }

  getMaxRain24h() {
    const max = Math.max(...this._rain24h);
    const mix = Math.min(...this._rain24h);

    if( max>DEFAULT_MAX_RAIN24H ) {
      return Math.ceil(max/20)*20 + 20;
    } else {
      return DEFAULT_MAX_RAIN24H;
    }
  }

  update() {
    if(this.myChart) {
    // console.log('ん？呼んだ？');

    this.myChart.data.labels = this._labels;

    this.myChart.data.datasets[0].data = this._highest;
    this.myChart.data.datasets[1].data = this._lowest;
    this.myChart.data.datasets[2].data = this._rain24h;
    this.myChart.options.scales.yAxes[1].ticks.max = this.getMaxRain24h();
//    this.myChart.data.datasets[3].data = this.snow;

    this.myChart.update();
    } else {
      // console.log('まだnullっぽい');
    }
  }

  rebuildChart() {
    // this.observatory_name = place;
    this.clearRanges();

    if(!this.myChart) {
      return;
    }

    //const date_to = this.yesterday.format('YYYY/MM/DD');
    const date_to = this._end_date;
    // moment.js が警告出すから： YYYY/MM/DD は、ISOとか的にイマイチらしい。なので YYYY-MM-DD に置換している
    const mo = moment(date_to.replace(/\//g,'-')).subtract(this._span-1,'days');
    const date_from = mo.format('YYYY/MM/DD');


    const label_days: string[] = [];
    //const m = this.yesterday.clone().subtract(13,'days');
    const m = mo.clone();
    for(let i=0;i<this._span;i++) {
      label_days.push( m.format('M/D'));
      m.add(1,'days');
    }

    this._labels = label_days;
    this.myChart.data.labels = this._labels;
    this.myChart.update();

    this.httpService.getHighestRange(
      this._name,
      date_from,
      date_to,
      data => {
        console.log(data);
        this._highest = data.map( (v) => {
          return v.temperature;
        });
        this.myChart.data.datasets[0].data = this._highest;
        this.myChart.update();
      }
    );

    this.httpService.getLowestRange(
      this._name,
      date_from,
      date_to,
      data => {
        console.log(data);
        this._lowest = data.map( (v) => {
          return v.temperature;
        });
        this.myChart.data.datasets[1].data = this._lowest;
        this.myChart.update();
      }
    );

    this.httpService.getRain24hRange(
      this._name,
      date_from,
      date_to,
      data => {
        console.log(data);
        this._rain24h = data.map( (v) => {
          return parseFloat(v.rainfall_amount);
        });
        this.myChart.data.datasets[2].data = this._rain24h;
        this.myChart.options.scales.yAxes[1].ticks.max = this.getMaxRain24h();
        this.myChart.update();
      }
    );

  }

  clearRanges() {
    this._highest = [];
    this._lowest = [];
    this._rain24h = [];
    // this.snow_range = [];
  }
}
