import {expect} from 'chai';

import {
  default as analyzeData,
  initFilters,
  consumeFilters,
  consumeFreeTextFilter
} from './analyzeData.js';

describe('lib:analyzeData', () => {
  describe('analyzeData', () => {
    const proto = {
      tools: {
        elements: []
      },
      transforms: {
        elements: []
      },
      filters: {
        elements: []
      }
    };

    it('should not crash but display an error when handling not valid tabs names', (done) => {
      const invalidTabNames = [
        Object.assign({}, proto, {tools: undefined}),
        Object.assign({}, proto, {transforms: undefined}),
        Object.assign({}, proto, {filters: undefined})
      ];
      invalidTabNames.forEach((invalid) => {
        const result = analyzeData(invalid);
        expect(result).to.be.undefined;
      });
      done();
    });

    it ('should do ok with valid filters', (done) => {
      const validFilters = [
        {
          key: 'mykey',
          title: 'coucou',
          options_mode: 'fixed',
          options_fr: '0|from us;1|from friends',
          options_en: '0|de nous;1|des autres'
        },
        // options_fr empty
        {
          key: 'mykey',
          title: 'coucou',
          options_mode: 'fixed',
          options_fr: '',
          options_en: '0|de nous;1|des autres'
        },
        // less items in fr than in en version
        {
          key: 'mykey',
          title: 'coucou',
          options_mode: 'fixed',
          options_fr: '0|from us;1|from friends',
          options_en: '0|de nous'
        }
      ];
      const validFilterVersion = Object.assign({}, proto, {
        filters: {
          elements: validFilters
        }
      });
      const data = analyzeData(validFilterVersion);
      expect(data).not.to.be.undefined;
      done();
    });

    it('should not crash but display an error when handling invalid filters', (done) => {
      const invalidFilters = [
        // no key field
        {
          title: 'coucou',
          options_mode: 'fixed',
          options_fr: '0|from us;1|from friends',
          options_en: '0|de nous;1|des autres'
        },
        // empty key field
        {
          title: 'coucou',
          key: '',
          options_mode: 'fixed',
          options_fr: '0|from us;1|from friends',
          options_en: '0|de nous;1|des autres'
        },
        // empty options field
        {
          title: 'coucou',
          options_fr: '0|from us;1|from friends',
          options_en: ''
        },
        // badly formatted values
        {
          key: 'mykey',
          title: 'coucou',
          options_mode: 'fixed',
          options_fr: '0lfrom us;1|from friends',
          options_en: '0|de nous;1des autres'
        }
      ];
      invalidFilters.forEach(invalid => {
        const invalidObj = Object.assign({}, proto, {
          filters: {
            elements: [invalid]
          }
        })
        const result = analyzeData(invalidObj);
        expect(result).to.be.undefined;
      });
      done();
    });

    it('should not crash but display an error when handling invalid transforms', (done) => {
      done();
    });
  });
  
  // todo
  // describe('initFilters', () => {

  // });

  // describe('consumeFilters', () => {

  // });

  // describe('consumeFreeTextFilter', () => {

  // });
});