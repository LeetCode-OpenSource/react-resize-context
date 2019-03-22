import * as React from 'react';
import { findDOMNode } from 'react-dom';
import * as fastdom from 'fastdom';

import { Size } from './types';
import { ContextValue, Provider } from './context';
import { getResizeDetector, getSize } from './methods';

export default class ResizeProvider extends React.PureComponent<{}, ContextValue> {
  readonly state: ContextValue = {
    size: null,
  };

  private currentListenElement: HTMLElement | null = null;

  private measureID?: any;

  private mutateID?: any;

  componentDidMount() {
    this.updateListenElement()
  }

  componentWillUnmount() {
    this.removeListener(this.currentListenElement);
  }

  render() {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    );
  }

  updateListenElement() {
    this.listenTo(this.getElement())
  }

  private onSizeChanged = (element: HTMLElement) => {
    fastdom.clear(this.measureID);

    this.measureID = fastdom.measure(() => {
      const size = getSize(element);
      this.updateSize(size)
    })
  };

  private updateSize = (size: Size) => {
    fastdom.clear(this.mutateID);

    this.mutateID = fastdom.mutate(() => {
      this.setState({ size: size })
    })
  };

  private getElement() {
    const element = findDOMNode(this);
    return element instanceof HTMLElement ? element : null;
  }

  private listenTo(element: HTMLElement | null) {
    this.removeListener(this.currentListenElement);

    this.currentListenElement = element;

    if (element) {
      getResizeDetector().listenTo(element, this.onSizeChanged)
    }
  }

  private removeListener(element: HTMLElement | null) {
    if (element) {
      getResizeDetector().removeListener(element, this.onSizeChanged)
    }
  }
}
