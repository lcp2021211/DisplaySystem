/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProxyService } from './proxy.service';

describe('Service: Proxy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProxyService]
    });
  });

  it('should ...', inject([ProxyService], (service: ProxyService) => {
    expect(service).toBeTruthy();
  }));
});
