import { useContext, useMemo } from 'react';

import { Context } from '../context';
import { Size } from '../types';

export function useResizeContext(): Size | null
export function useResizeContext<T>(reducer: (size: Size | null) => T): T
export function useResizeContext<T>(reducer?: (size: Size | null) => T): T {
  const { size } = useContext(Context);
  const result = typeof reducer === 'function' ? reducer(size) : size as unknown as T;

  return useMemo(() => result, [result]);
}
