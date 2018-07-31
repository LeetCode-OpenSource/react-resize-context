import { ReactElement, RefObject } from 'react';

export interface Size {
  width: number;
  height: number;
}

export interface ResizeChildren extends ReactElement<any> {
  ref?: RefObject<HTMLElement>;
}

export type OnResizeCallBack = (size: Size) => void;
