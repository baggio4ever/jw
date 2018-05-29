import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatButtonModule, MatCheckboxModule,MatNativeDateModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {JwHttpService} from './jw-http.service';
import { JwChartComponent } from './jw-chart/jw-chart.component';
import { JwObservatoryComponent } from './jw-observatory/jw-observatory.component';
import { JwObservatoryListPageComponent } from './jw-observatory-list-page/jw-observatory-list-page.component';
import { JwRankingPageComponent } from './jw-ranking-page/jw-ranking-page.component';
import { JwNotFoundPageComponent } from './jw-not-found-page/jw-not-found-page.component';

const appRoutes: Routes = [
  { path: 'ranking', component: JwRankingPageComponent },
  { path: 'list',    component: JwObservatoryListPageComponent },
  { path: '',
    redirectTo: '/ranking',
    pathMatch: 'full'
  },
  { path: '**', component: JwNotFoundPageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    JwChartComponent,
    JwObservatoryComponent,
    JwObservatoryListPageComponent,
    JwRankingPageComponent,
    JwNotFoundPageComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    HttpClientModule,  // HTTP通信モジュールをインポート
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatSnackBarModule
  ],
  providers: [
    JwHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
