import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitIssuesListComponent } from './git-issues-list.component';

describe('GitIssuesListComponent', () => {
  let component: GitIssuesListComponent;
  let fixture: ComponentFixture<GitIssuesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitIssuesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitIssuesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
