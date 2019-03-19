import * as React from 'react';
import { findDOMNode } from 'react-dom';

import { Provider } from './context';
import Listener from './Listener';

interface Props {
  children: React.ReactNode;
}

interface State {
  element: HTMLElement | null;
}

export default class ResizeProvider extends React.PureComponent<Props, State> {
  public state: State = {
    element: null,
  };

  public componentDidMount() {
    this.updateListenElement();
  }

  public componentWillUnmount() {
    this.removeListenElement();
  }

  public render() {
    return (
      <Provider value={{ listenElement: this.state.element }}>
        {this.props.children}
      </Provider>
    );
  }

  public updateListenElement() {
    const element = this.getElement();

    if (element !== this.state.element) {
      this.removeListenElement();

      if (element) {
        Listener.shared.startListen(element);
      }

      this.setState({ element });
    }
  }

  private getElement() {
    const element = findDOMNode(this);
    return element instanceof HTMLElement ? element : null;
  }

  private removeListenElement() {
    if (this.state.element) {
      Listener.shared.stopListen(this.state.element);
    }
  }
}
