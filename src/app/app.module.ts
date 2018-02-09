import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCardModule, MatCell, MatCheckboxModule, MatDialogModule, MatExpansionModule, MatFormFieldModule,
  MatHeaderCell,
  MatIconModule, MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatTable,
  MatTableModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { GitIssuesListComponent } from './git-issues-list/git-issues-list.component';
import { JiraIssuesListComponent } from './jira-issues-list/jira-issues-list.component';
import {HttpClientModule} from '@angular/common/http';
import { NewIssueComponent } from './new-issue/new-issue.component';
import {FormsModule} from '@angular/forms';
import { ConfigComponent } from './config/config.component';
import { ErrorComponent } from './error/error.component';

@NgModule({
  declarations: [
    AppComponent,
    GitIssuesListComponent,
    JiraIssuesListComponent,
    NewIssueComponent,
    ConfigComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatCardModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatIconModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  entryComponents: [NewIssueComponent, ConfigComponent, ErrorComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
