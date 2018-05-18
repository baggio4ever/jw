import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatButtonModule, MatCheckboxModule,MatNativeDateModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {JwHttpService} from './jw-http.service';
import { JwChartComponent } from './jw-chart/jw-chart.component';
import { JwObservatoryComponent } from './jw-observatory/jw-observatory.component';

@NgModule({
  declarations: [
    AppComponent,
    JwChartComponent,
    JwObservatoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    HttpClientModule,  // HTTP通信モジュールをインポート
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    JwHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
