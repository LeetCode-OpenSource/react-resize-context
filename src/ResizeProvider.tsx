import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { ContextValue, Provider } from './context';
import { getResizeDetector, getSize } from './methods';

export default class ResizeProvider extends React.PureComponent<{}, ContextValue> {
  readonly state: ContextValue = {
    size: null,
  };

  private currentListenElement: HTMLElement | null = null;

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
    this.setState({ size: getSize(element) })
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
