/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopologyService } from './topology.service';

describe('Service: Topology', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopologyService]
    });
  });

  it('should ...', inject([TopologyService], (service: TopologyService) => {
    expect(service).toBeTruthy();
  }));
});
