import { Button } from '@/components/ui/button';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('Button component', () => {
  it('renders title and responds to press', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Press me" onPress={onPress} />);

    const btn = getByText('Press me');
    expect(btn).toBeTruthy();

    fireEvent.press(btn);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
