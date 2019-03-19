import * as React from 'react';

import { Size } from './types';
import { useResizeContext } from './hooks';

export function renderWithSize<T, P extends T = T>(
  reducer: (size: Size | null) => T,
  renderFunction: (props: P) => React.ReactNode,
) {
  const MemoRender = React.memo(renderFunction as React.FunctionComponent<P>);

  return (props: Pick<P, Exclude<keyof P, keyof T>>) => <MemoRender {...props} {...useResizeContext(reducer)} />
}
