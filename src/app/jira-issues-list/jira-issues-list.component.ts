import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatTableDataSource} from '@angular/material';
import {Jira, JiraIssue} from '../libs/jira';
import {GitIssue} from '../libs/gitlab';
import {NewIssueComponent} from '../new-issue/new-issue.component';

@Component({
  selector: 'app-jira-issues-list',
  templateUrl: './jira-issues-list.component.html',
  styleUrls: ['./jira-issues-list.component.css']
})
export class JiraIssuesListComponent implements OnInit {
  data: [JiraIssue];
  displayedColumns = ['title', 'state', 'sync'];
  dataSource: MatTableDataSource<JiraIssue>;
  _sprint: any;
  @Input() androidMilestone: any;
  @Input() iosMilestone: any;

  @Input() set sprint(value: any) {
    this._sprint = value;
    this.update();
  } // 'Sprint 9 (R4)'

  _gitIssues: [GitIssue];
  @Input() set gitIssues(issues: [GitIssue]) {
    this._gitIssues = issues;
    this.checkGitStatus();
  }

  loading = false;

  constructor(public dialog: MatDialog) {
  }

  checkGitStatus() {
    const gitIssues = this._gitIssues;
    const jiraIssues = this.data;
    if (gitIssues && jiraIssues) {
      const bolthIssues = [];
      for (let i = 0; i < jiraIssues.length; i += 1) {
        const jiraIssue = jiraIssues[i];
        let tem = false;
        for (let j = 0; j < gitIssues.length; j += 1) {
          const gitIssue = gitIssues[j];
          if (gitIssue.title.trim().toLowerCase() == jiraIssue.name.trim().toLowerCase()) {
            // Igualzinha
            bolthIssues.push(gitIssue);
            // gitIssues.splice(j, 1);
            // jiraIssues.splice(i, 1);
            if (gitIssue.project_id === 31) {
              jiraIssue.syncAndroid = gitIssue;
            }
            if (gitIssue.project_id === 32) {
              jiraIssue.syncIOS = gitIssue;
            }
            tem = true;
          }
        }

      }
    }
  }

  openDialogAndroid(issue: JiraIssue): void {
    // const dialog = new NewIssueComponent(dialogRef);
    const dialogRef = this.dialog.open(NewIssueComponent, {
      width: '600px',
      data: {
        title: issue.name,
        description: issue.description,
        milestone: this.androidMilestone,
        id: issue.key,
        type: issue.type,
        versao: issue.versao,
        projectID: 31,
        label: issue.versao + ',' + issue.type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      if (result) {
        issue.syncAndroid = result;
      }
    });
  }

  openDialogIOS(issue: JiraIssue): void {
    // const dialog = new NewIssueComponent(dialogRef);
    const dialogRef = this.dialog.open(NewIssueComponent, {
      width: '600px',
      data: {
        title: issue.name,
        description: issue.description,
        milestone: this.iosMilestone,
        id: issue.key,
        type: issue.type,
        versao: issue.versao,
        projectID: 32,
        label: issue.versao + ',' + issue.type
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed: ', result);
      // this.animal = result;
      if (result) {
        issue.syncIOS = result;
      }
    });
  }

  update() {
    if (this._sprint) {
      this.loading = true;
      Jira.getIssues(this._sprint.id).then((data: [JiraIssue]) => {
        this.data = data;
        this.loading = false;
        this.dataSource = new MatTableDataSource(this.data);
        this.checkGitStatus();
      });
    }
  }

  ngOnInit() {

  }

}
