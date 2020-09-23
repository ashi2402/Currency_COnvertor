import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CurrencyService } from './currency.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Currency } from '../currency/currency';
import { HttpEvent, HttpEventType } from '@angular/common/http';

describe('CurrencyService', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let currencyService: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CurrencyService]
    });
    httpClient = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
    currencyService = TestBed.get(CurrencyService);

  }
  );
  // Test case get country list

  it('get country list when called getCountryList()', () => {
    const expectedData = [
      { country: 'india', currency_code: 'INR' },
      { country: 'USA', currency_code: 'USA' }
    ] as Currency[];

    currencyService.getCountryList().subscribe((res) => {
      expect(res).toEqual(expectedData);
    });

    const req = httpMock.expectOne('assets/data/data.json');
    expect(req.request.method).toEqual('GET');
    req.flush(expectedData);

    httpMock.verify();
  });

  //  Test case for currency value

  it('should give all other corrency details when base currency send', () => {
    const expectedVal = {
      base: 'USD',
      date: '2020-04-01',
      rates: {}
    };

    currencyService.getCurrencyData('data').subscribe(res => {
      expect(res).toEqual(expectedVal);
    });
    const data = 'data';
    const req = httpMock.expectOne(`https://api.exchangeratesapi.io/latest?base=${data}`);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedVal);

    httpMock.verify();
  });



  it('should be created', () => {
    const service: CurrencyService = TestBed.get(CurrencyService);
    expect(service).toBeTruthy();
  });
});
