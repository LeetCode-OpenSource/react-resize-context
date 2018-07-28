import * as React from 'react';

import { Provider } from './context';
import Listener from './Listener';
import { getElement, makeSureChildrenHasRef } from './methods';

import { ResizeChildren } from './types';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  children: ResizeChildren | null;
  element: HTMLElement | null;
}

export default class ResizeProvider extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps(props: Props) {
    return {
      children: makeSureChildrenHasRef(props.children),
    };
  }

  public state: State = {
    children: null,
    element: null,
  };

  public componentDidMount() {
    this.updateListenElement();
  }

  public componentDidUpdate() {
    this.updateListenElement();
  }

  public componentWillUnmount() {
    this.removeListenElement();
  }

  public render() {
    return (
      <Provider value={{ listenElement: this.state.element }}>
        {this.state.children}
      </Provider>
    );
  }

  private updateListenElement() {
    const element = getElement(this.state.children);

    if (element !== this.state.element) {
      this.removeListenElement();

      if (element) {
        Listener.shared.startListen(element);
      }

      this.setState({ element });
    }
  }

  private removeListenElement() {
    if (this.state.element) {
      Listener.shared.stopListen(this.state.element);
    }
  }
}
