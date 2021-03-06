import parseLxlTag from 'ember-letter-by-letter/utils/parse-lxl-tag';
import { module, test } from 'qunit';

module('Unit | Utility | parse lxl tag');

test('it grabs the tagName', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[foo]]');

  assert.equal(result.tagName, 'foo', 'tagName is correct');
});

test('`method` is "start" if `#`', function(assert) {
  assert.expect(3);

  const result = parseLxlTag('[[#foo]]');

  assert.equal(result.method, 'open', 'method is correct');
  assert.ok(result.isOpening, '`isOpening` is true');
  assert.ok(!result.isClosing, '`isClosing` is false');
});

test('`method` is "start" if none', function(assert) {
  assert.expect(3);

  const result = parseLxlTag('[[foo]]');

  assert.equal(result.method, 'execute', 'method is correct');
  assert.ok(!result.isOpening, '`isOpening` is false');
  assert.ok(!result.isClosing, '`isClosing` is false');
});

test('`method` is "stop" if `/`', function(assert) {
  assert.expect(3);

  const result = parseLxlTag('[[/foo]]');

  assert.equal(result.method, 'close', 'method is correct');
  assert.ok(!result.isOpening, '`isOpening` is false');
  assert.ok(result.isClosing, '`isClosing` is true');
});

test('`params` are split by spaces', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[/foo bar baz]]');

  assert.deepEqual(result.params, ['bar', 'baz'], 'params are correct');
});

test('`params` are split by spaces, unless in quotes', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[/foo "I went to the bar, and \'ordered\' a drink" baz \'single quotes "also" work\' "as do a coder\'s unmatched quotes"]]');

  assert.deepEqual(result.params, [
    "I went to the bar, and 'ordered' a drink",
    'baz',
    'single quotes "also" work',
    "as do a coder's unmatched quotes"
  ], 'params are correct');
});

test('`params` can contain inner arrays', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[/foo bar (array inner "and string" (array deep) last) baz]]');

  assert.deepEqual(result.params, [
    'bar',
    [
      'inner',
      'and string',
      ['deep'],
      'last'
    ],
    'baz'
  ], 'params are correct');
});

test('`params` can contain inner hashes', function(assert) {
  assert.expect(1);

  const result = parseLxlTag('[[/foo bar (hash foo=bar "key string"="value string" myHash=(hash baz=burger myArray=(array 1 2 3 -4 +5 true false) another=value)) baz]]');

  assert.deepEqual(result.params, [
    'bar',
    {
      foo: 'bar',
      'key string': 'value string',
      myHash: {
        baz: 'burger',
        myArray: [1, 2, 3, -4, '+5', true, false],
        another: 'value'
      }
    },
    'baz'
  ], 'params are correct');
});
