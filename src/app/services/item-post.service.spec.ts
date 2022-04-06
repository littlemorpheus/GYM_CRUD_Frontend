import { TestBed } from '@angular/core/testing';

import { ItemPostService } from './item-post.service';

describe('ItemPostService', () => {
  let service: ItemPostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
