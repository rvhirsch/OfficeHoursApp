'use strict';

describe('Hours E2E Tests:', function () {
  describe('Test hours page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/hours');
      expect(element.all(by.repeater('hour in hours')).count()).toEqual(0);
    });
  });
});
