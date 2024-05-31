import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewEditComponent } from './modal-new-edit.component';

describe('ModalNewEditComponent', () => {
  let component: ModalNewEditComponent;
  let fixture: ComponentFixture<ModalNewEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModalNewEditComponent]
    });
    fixture = TestBed.createComponent(ModalNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
