import { TestBed } from '@angular/core/testing';

import { InternetConnectivityService } from './internet-connectivity.service';

describe('InternetConnectivityService', () => {
  let service: InternetConnectivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetConnectivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
