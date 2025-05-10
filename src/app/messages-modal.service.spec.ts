import { TestBed } from '@angular/core/testing';

import { MessagesModalService } from './messages-modal.service';

describe('MessagesModalService', () => {
  let service: MessagesModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
