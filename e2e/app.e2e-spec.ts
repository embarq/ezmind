import { EzmindPage } from './app.po';

describe('ezmind App', () => {
  let page: EzmindPage;

  beforeEach(() => {
    page = new EzmindPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('em works!');
  });
});
