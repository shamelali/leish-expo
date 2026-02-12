import { useCallback, useEffect, useState } from 'react';

export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseAsyncOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true,
  options?: UseAsyncOptions
) {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await asyncFunction();
      setState({ data: response, loading: false, error: null });
      options?.onSuccess?.(response);
      return response;
    } catch (error: any) {
      const errorMessage = error?.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      options?.onError?.(error);
      throw error;
    }
  }, [asyncFunction, options]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute, refetch: execute };
}

export interface UseMutationState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useMutation<T = any, V = any>(
  mutationFunction: (variables: V) => Promise<T>,
  options?: UseAsyncOptions
) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: V) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await mutationFunction(variables);
        setState({ data: response, loading: false, error: null });
        options?.onSuccess?.(response);
        return response;
      } catch (error: any) {
        const errorMessage = error?.message || 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        options?.onError?.(error);
        throw error;
      }
    },
    [mutationFunction, options]
  );

  return { ...state, mutate };
}
