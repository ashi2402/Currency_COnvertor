import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { CurrencyService } from '../services/currency.service';
import { MockComponent } from 'ng-mocks';
import { CurrencyComponent } from './currency.component';
import { DropdownModule, Dropdown } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';
import * as Rx from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TableModule } from 'primeng/table';


describe('CurrencyComponent', () => {
  let component: CurrencyComponent;
  let fixture: ComponentFixture<CurrencyComponent>;
  let currencyService: CurrencyService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // tslint:disable-next-line: max-line-length
      imports: [DropdownModule, HttpClientTestingModule, ReactiveFormsModule, FormsModule, CalendarModule, RouterTestingModule],
      declarations: [CurrencyComponent],
      providers: [CurrencyService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyComponent);
    currencyService = TestBed.get(CurrencyService);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();

  });
  it('should call getCountry list and get response', fakeAsync(
    () => {
      const service = fixture.debugElement.injector.get(CurrencyService);
      spyOn(service, 'getCountryList').and.callFake(() => {
        return Rx.of([{ country: 'United Arab Emirates', currency_code: 'AED' }]).pipe(delay(100));
      });
      component.ngOnInit();
      tick(100);
      expect(component.countries.length).toBeGreaterThan(0);
      flush();
    }
  )
  );

  it('Should display USD as default currency', () => {
    // tslint:disable-next-line: no-shadowed-variable
    const fixture = TestBed.createComponent(CurrencyComponent);
    const testHost = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const select = compiled.querySelector('.defaultVal');
    expect(select.textContent).toContain('USD');
  });

  it('Should display curency name if it is selected', () => {
    const testHost = fixture.componentInstance;
    testHost.selectedCurrency = 'INR';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const select = compiled.querySelector('.selectedVal');
    const notSelected = fixture.debugElement.query(By.css('defaultVal'));
    expect(select.textContent).toContain('INR');
    expect(notSelected).toBeNull();
  });


  it('Should get data when getCurrencyData called', fakeAsync(() => {
    const service = fixture.debugElement.injector.get(CurrencyService);
    spyOn(service, 'getCurrencyData').and.callFake(() => {
      // tslint:disable-next-line: max-line-length
      return Rx.of({ base: 'USD', date: '2020-09-18', rates: { CAD: 1.3184315051, HKD: 7.7501056368, ISK: 135.8911518634, PHP: 48.4289698301 } }).pipe(delay(100));
    });
    component.ngOnInit();
    fixture.detectChanges();
    tick(100);
    expect(component.currency.length).toBeGreaterThan(0);
    flush();
  }));

  it('is currency compare form valid when empty', () => {
    // tslint:disable-next-line: no-string-literal
    const currencyFrom = component.compareForm.controls['currencyFrom'];
    currencyFrom.setValue('AUS');
    // tslint:disable-next-line: no-string-literal
    const currencyTo = component.compareForm.controls['currencyTo'];
    currencyTo.setValue('INR');
    expect(component.compareForm.valid).toBeTruthy();
  });

  it('is currency form form valid when empty', () => {
    // tslint:disable-next-line: no-string-literal
    const currencyFrom = component.currencyForm.controls['currencyFrom'];
    currencyFrom.setValue('AUS');
    // tslint:disable-next-line: no-string-literal
    const currencyTo = component.currencyForm.controls['currencyTo'];
    currencyTo.setValue('INR');
    // tslint:disable-next-line: no-string-literal
    const date = component.currencyForm.controls['period'];
    const todayDate = new Date();
    date.setValue(todayDate);
    expect(component.currencyForm.valid).toBeTruthy();
  });

});
