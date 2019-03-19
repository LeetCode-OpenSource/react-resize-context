import * as elementResizeDetectorMaker from 'element-resize-detector';
import { once } from 'lodash';

import { getSize } from './methods';

import { OnResizeCallBack } from './types';

const getSharedListener = once(() => new Listener());

export default class Listener {
  public static get shared(): Listener {
    return getSharedListener();
  }

  private resizeDetector = elementResizeDetectorMaker({ strategy: 'scroll' });

  private callbacks = new Map<HTMLElement, Set<OnResizeCallBack>>();

  public startListenTo(element: HTMLElement, func: OnResizeCallBack) {
    if (element instanceof Element && typeof func === 'function') {
      const currentElementCallbacks = this.callbacks.get(element);

      if (currentElementCallbacks) {
        currentElementCallbacks.add(func);
      } else {
        this.callbacks.set(element, new Set<OnResizeCallBack>([func]));
      }

      func(getSize(element));
    }
  }

  public stopListenTo(element: HTMLElement, func: OnResizeCallBack) {
    const currentElementCallbacks = this.callbacks.get(element);

    if (currentElementCallbacks) {
      currentElementCallbacks.delete(func);
    }
  }

  public startListen(element: HTMLElement) {
    this.resizeDetector.listenTo(element, this.onSizeChanged);
  }

  public stopListen(element: HTMLElement) {
    this.resizeDetector.uninstall(element);
  }

  private onSizeChanged = (element: HTMLElement) => {
    const callbacks = this.callbacks.get(element);

    if (callbacks) {
      const size = getSize(element);
      callbacks.forEach((func) => func(size));
    }
  };
}
