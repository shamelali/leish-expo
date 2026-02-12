import { TextInputField } from '@/components/ui/input';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('TextInputField component', () => {
  it('renders label and handles text change', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <TextInputField
        label="Name"
        placeholder="Enter name"
        value=""
        onChangeText={onChangeText}
      />
    );

    expect(getByText('Name')).toBeTruthy();
    const input = getByPlaceholderText('Enter name');
    fireEvent.changeText(input, 'Alice');
    expect(onChangeText).toHaveBeenCalledWith('Alice');
  });
});
