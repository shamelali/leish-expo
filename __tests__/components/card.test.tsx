import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('Card component', () => {
  it('renders children content', () => {
    const { getByText } = render(
      <Card>
        <ThemedText>Card Content</ThemedText>
      </Card>
    );

    expect(getByText('Card Content')).toBeTruthy();
  });
});
