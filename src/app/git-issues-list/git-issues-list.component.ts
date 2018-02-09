import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GitIssue, GitLab} from '../libs/gitlab';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-git-issues-list',
  templateUrl: './git-issues-list.component.html',
  styleUrls: ['./git-issues-list.component.css']
})
export class GitIssuesListComponent implements OnInit {
  data: Array<GitIssue>;
  displayedColumns = ['title', 'state', 'labels', 'web_url'];
  dataSource: MatTableDataSource<GitIssue>;
  _sprintIOS: any;
  _sprintAndroid: any;

  @Input() set sprintIOS(value: any) {
    this._sprintIOS = value;
    this.updateIssues();
  } // 'Sprint 9 (R4)'
  @Input() set sprintAndroid(value: any) {
    this._sprintAndroid = value;
    this.updateIssues();

  } // 'Sprint 9 (R4)'
  @Output() dataUpdated = new EventEmitter<Array<GitIssue>>();
  loading = false;

  constructor() {
  }

  updateIssues() {
    if (this._sprintAndroid && this._sprintIOS) {
      this.loading = true;
      console.log(this._sprintIOS);
      console.log(this._sprintAndroid);
      Promise.all(
        [
          GitLab.getIssues(31, this._sprintIOS.title),
          GitLab.getIssues(32, this._sprintAndroid.title),
        ]
      ).then((data: any) => {
        this.loading = false;
        this.data = new Array<GitIssue>();
        for (const i of data[0]) {
          this.data.push(i);
        }
        for (const i of data[1]) {
          this.data.push(i);
        }
        this.dataSource = new MatTableDataSource(this.data);
        this.dataUpdated.emit(this.data);
      }).catch((err) => {
        this.loading = false;

      });
    }
  }

  ngOnInit() {

  }

}
