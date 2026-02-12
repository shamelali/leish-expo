import { capitalize, formatCurrency, slugify, truncateText } from '../../utils/formatting';

describe('formatting utilities', () => {
  test('truncateText short text unchanged', () => {
    expect(truncateText('short', 10)).toBe('short');
  });

  test('truncateText truncates long text', () => {
    expect(truncateText('This is a long sentence', 10)).toBe('This is...');
  });

  test('capitalize capitalizes first letter', () => {
    expect(capitalize('john')).toBe('John');
  });

  test('slugify produces expected slug', () => {
    expect(slugify('My Blog Post!')).toBe('my-blog-post');
  });

  test('formatCurrency returns currency string', () => {
    const out = formatCurrency(99.99, 'USD');
    expect(out).toContain('$');
  });
});
