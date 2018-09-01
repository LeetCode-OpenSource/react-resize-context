import * as shallowequal from 'shallowequal';

import { Size } from './types';

export function getSize(element: HTMLElement): Size {
  return {
    height: element.clientHeight,
    width: element.clientWidth,
  };
}

export function isRefObject(ref: any): boolean {
  return ref && typeof ref === 'object' && 'current' in ref;
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
