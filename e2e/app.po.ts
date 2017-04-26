import { browser, element, by } from 'protractor';

export class EzmindPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('em-root h1')).getText();
  }
}
