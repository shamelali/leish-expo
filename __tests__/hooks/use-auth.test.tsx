import { useAuth } from '@/hooks/use-auth';
import { act, render } from '@testing-library/react-native';
import React from 'react';
import { Text } from 'react-native';

jest.mock('@/services/auth');

const { authService } = require('@/services/auth');

function TestAuth() {
  const { user, isAuthenticated } = useAuth();

  return (
    <>
      <Text testID="user">{user ? user.email : ''}</Text>
      <Text testID="auth">{isAuthenticated ? 'true' : 'false'}</Text>
    </>
  );
}

describe('useAuth hook (basic)', () => {
  it('initializes without crashing', async () => {
    const { getByTestId } = render(<TestAuth />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(getByTestId('auth').props.children).toMatch(/(true|false)/);
  }, 10000);

  it('login updates user in store', async () => {
    // override mock implementation
    authService.login = jest.fn().mockResolvedValue({ user: { email: 'test@x.com', id: '123', name: 'Test' }, token: 'tok' });

    function TestLogin() {
      const { user, login } = useAuth();

      React.useEffect(() => {
        void (async () => {
          await login('test@x.com', 'pass');
        })();
      }, []);

      return <Text testID="user">{user ? user.email : ''}</Text>;
    }

    const { getByTestId } = render(<TestLogin />);

    await act(async () => {
      await Promise.resolve();
    });

    expect(authService.login).toHaveBeenCalledWith('test@x.com', 'pass');
    expect(getByTestId('user').props.children).toBe('test@x.com');
  }, 10000);
});
