import { Jira2gitPage } from './app.po';

describe('jira2git App', () => {
  let page: Jira2gitPage;

  beforeEach(() => {
    page = new Jira2gitPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
