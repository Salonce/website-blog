import { TestBed } from '@angular/core/testing';

import { ContentBlockService } from './content-block-service';

describe('ContentBlockService', () => {
  let service: ContentBlockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentBlockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
