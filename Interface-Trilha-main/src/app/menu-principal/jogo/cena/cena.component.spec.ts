import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenaComponent } from './cena.component';

describe('CenaComponent', () => {
  let component: CenaComponent;
  let fixture: ComponentFixture<CenaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
