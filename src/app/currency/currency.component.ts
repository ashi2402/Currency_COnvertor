import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { CurrencyService } from '../services/currency.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { options } from './chartOption';

interface City {
  country: string;
  currency_code: string;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})


export class CurrencyComponent implements OnInit {


  currency: any;
  countries: any;
  cols: any[];
  selectedCity: City;
  selectedCurrency = '';
  date: string;
  cur: string;
  currencyFrom: any;
  currencyTo: any;
  currencyFromName: any;
  currencyToName: any;
  firstVal;
  secondVal;
  compareResponse = false;
  chartOptions: {};
  Highcharts;
  maxDate = new Date();

  constructor(
    private currencyService: CurrencyService,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder
  ) { }

  compareForm = this.fb.group({
    currencyFrom: ['', Validators.required],
    currencyTo: ['', Validators.required],
  });

  currencyForm = this.fb.group({
    currencyFrom: ['', Validators.required],
    currencyTo: ['', Validators.required],
    period: ['', Validators.required]
  });


  ngOnInit() {
    this.currencyService.getCountryList().subscribe(res => {
      this.countries = res;
    });

    this.getCurrenctData('USD');
    // List data
    this.currency = [];
    this.cols = [
      { field: 'currency', header: 'Currency' },
      { field: 'val', header: 'Value' }
    ];
    this.Highcharts = Highcharts;
    this.chartOptions = options;
    Highcharts.chart('container', this.chartOptions);
  }

  // Submit Method for Currency conversion

  onSubmit() {
    const data = {};
    // tslint:disable-next-line: no-string-literal
    data['from'] = this.compareForm.value['currencyFrom'];
    // tslint:disable-next-line: no-string-literal
    data['to'] = this.compareForm.value['currencyTo'];

    // tslint:disable-next-line: no-string-literal
    if (data['from'] !== '' || data['to'] !== '') {
      // tslint:disable-next-line: no-string-literal
      if (data['from'] === '' || data['to'] === '') {
        alert('Currency can\'t be compare with single value');
        // tslint:disable-next-line: no-string-literal
      } else if (data['from'] !== data['to']) {
        this.currencyService.compareCurrency(data).subscribe(res => {
          this.compareResponse = true;
          // tslint:disable-next-line: no-string-literal
          const responseArray = Object.entries(res['quotes']);
          this.currencyFromName = (responseArray[0][0]).slice(3, 7);
          this.currencyToName = (responseArray[1][0]).slice(3, 7);
          // tslint:disable-next-line: radix
          this.firstVal = responseArray[0][1];
          // tslint:disable-next-line: radix
          this.secondVal = responseArray[1][1];
          this.currencyFrom = (this.firstVal / this.secondVal).toFixed(3);
        });
      } else {
        alert('Both Currency can\'t be same');
      }
    } else {
      alert('Both Currency can\'t be blank');
    }
  }


  //  Currency Comparison

  compareCurrency() {
    const data = {};
    console.log('currency', this.currencyForm.value);
    // tslint:disable-next-line: no-string-literal
    data['from'] = this.currencyForm.value['currencyFrom'];
    // tslint:disable-next-line: no-string-literal
    data['to'] = this.currencyForm.value['currencyTo'];
    // tslint:disable-next-line: no-string-literal
    data['endDate'] = moment(this.currencyForm.value['period']).format('YYYY-MM-DD');
    // tslint:disable-next-line: no-string-literal
    data['startDate'] = moment(this.currencyForm.value['period']).subtract(8, 'days').format('YYYY-MM-DD');
    // tslint:disable-next-line: no-string-literal
    if (data['from'] !== '' && data['to'] !== '' && data['period'] !== '') {
      this.currencyService.currencyOverPeriod(data).subscribe(response => {
        console.log('response', response);
        const resKey = Object.keys(response);
        const resVal = Object.values(response);
        const resDate = Object.keys(resVal[0]);
        const resData = Object.entries(Object.values(resVal[0]));
        const resDataArray = [];
        resData.map(ele => {
          resDataArray.push(ele[1]);
        });
        const nameFirst = resKey[0].slice(0, 3);
        const nameLast = resKey[0].slice(4);
        const chartNewoptions = options;
        // tslint:disable-next-line: no-string-literal
        chartNewoptions['series'][0]['name'] = `${nameFirst} Vs ${nameLast}`;
        // tslint:disable-next-line: no-string-literal
        chartNewoptions['series'][0]['data'] = resDataArray;
        this.Highcharts = Highcharts;
        this.chartOptions = chartNewoptions;
        Highcharts.chart('container', this.chartOptions);
        this.cd.detectChanges();
      });
    } else {
      alert('Please select Currency and Date');
    }
  }

  // GET currency data

  getCurrenctData(data) {

    this.currencyService.getCurrencyData(data).subscribe(res => {
      // tslint:disable-next-line: no-string-literal
      this.date = res['date'] || '';
      // tslint:disable-next-line: no-string-literal
      this.cur = res['base'] || '';
      // tslint:disable-next-line: no-string-literal
      const arr = Object.entries(res['rates']);
      arr.length = 14;

      arr.map(ele => {
        const currencyobj = {};
        // tslint:disable-next-line: no-string-literal
        currencyobj['currency'] = ele[0];
        // tslint:disable-next-line: no-string-literal
        currencyobj['val'] = ele[1];
        this.currency.push(currencyobj);
      });
    });
  }

  // Convert currency

  changeCurrency(event) {
    if (this.selectedCity !== null) {
      this.selectedCurrency = this.selectedCity.currency_code;
      this.getCurrenctData(this.selectedCurrency);
      this.currency = [];
    } else {
      this.selectedCurrency = '';
      this.getCurrenctData('USD');
      this.cd.detectChanges();
      this.currency = [];
    }

  }

  // Reset form
  resetVal(event) {
    this.compareForm.reset();
    this.compareResponse = false;
  }

}
