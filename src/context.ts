import * as React from 'react';

export interface ContextValue {
  listenElement: HTMLElement | null;
}

export const { Provider, Consumer } = React.createContext<ContextValue>({
  listenElement: null,
});
