import { useAsync } from '@/hooks/use-async';
import { act, render } from '@testing-library/react-native';
import { Text } from 'react-native';

function TestComponent({ fn }: { fn: () => Promise<any> }) {
  const { data, loading, error } = useAsync(fn, true);

  return (
    <>
      <Text testID="loading">{loading ? 'true' : 'false'}</Text>
      <Text testID="data">{data ? JSON.stringify(data) : ''}</Text>
      <Text testID="error">{error || ''}</Text>
    </>
  );
}

describe('useAsync hook', () => {
  it('fetches data successfully', async () => {
    const mockFn = jest.fn().mockResolvedValue({ id: 1 });

    const { getByTestId } = render(<TestComponent fn={mockFn} />);

    // wait for the effect
    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('loading').props.children).toBe('false');
    expect(getByTestId('data').props.children).toBe(JSON.stringify({ id: 1 }));
    expect(getByTestId('error').props.children).toBe('');
  });
});
