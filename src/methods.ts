import * as React from 'react';
import * as shallowequal from 'shallowequal';

import { ResizeChildren, Size } from './types';
import { ReactNode, Ref } from 'react';

export function getSize(element: HTMLElement): Size {
  return {
    height: element.clientHeight,
    width: element.clientWidth,
  };
}

export function isRefObject(ref: any): boolean {
  return ref && typeof ref === 'object' && 'current' in ref;
}

export function getElement(children?: ResizeChildren | null): HTMLElement | null {
  const element =
    children &&
    children.ref &&
    children.ref.current;
  return element || null;
}

export function makeSureChildrenHasRef(
  children: ReactNode
): ResizeChildren | null {
  if (React.isValidElement(children)) {
    if (isRefObject((children as ResizeChildren).ref)) {
      return children;
    } else {
      return React.cloneElement<{ ref?: Ref<HTMLElement> }>(
        children, { ref: React.createRef() }
      ) as ResizeChildren;
    }
  } else return null;
}

function compareDataset(
  currentValue: any,
  nextValue: any,
  key?: string | number,
) {
  if (key !== undefined) {
    return String(currentValue) === String(nextValue);
  } else {
    return undefined;
  }
}

export function updateElementDataAttributes(
  element: HTMLElement,
  dataset: DOMStringMap,
): void {
  const currentDataset = element.dataset;
  const nextDataset = { ...dataset };

  if (!shallowequal(currentDataset, nextDataset, compareDataset)) {
    Object.keys(currentDataset).forEach((key) => {
      if (currentDataset[key] !== nextDataset[key]) {
        currentDataset[key] = nextDataset[key];
      }
      delete nextDataset[key];
    });

    Object.keys(nextDataset).forEach((key) => {
      currentDataset[key] = nextDataset[key];
    });
  }
}
