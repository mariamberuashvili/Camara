import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { AlumnoService } from './alumnoservices';

describe('AlumnoService', () => {
  let service: AlumnoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(AlumnoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
