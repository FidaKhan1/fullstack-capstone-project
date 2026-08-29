const test = require('node:test');
const assert = require('node:assert/strict');
const { analyzeSentence } = require('../index');

test('sentiment analyzer reports positive text', () => {
    const result = analyzeSentence('This gift is useful and wonderful');
    assert.equal(result.sentiment, 'positive');
});
