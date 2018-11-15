import * as React from 'react';
import { omit } from 'lodash';

import { HTMLAttributes, ReactNode, RefObject, FunctionComponent } from 'react';

import { Consumer, ContextValue } from './context';
import Listener from './Listener';
import { updateElementDataAttributes } from './methods';

import { Size } from './types';

interface ExternalProps extends HTMLAttributes<HTMLDivElement> {
  innerRef?: RefObject<HTMLDivElement>;
  onSizeChanged?: (size: Size) => void;
  updateDatasetBySize?: (size: Size) => DOMStringMap;
  children?: ReactNode | FunctionComponent<Size>;
}

interface Props extends ExternalProps {
  innerRef: RefObject<HTMLDivElement>;
  context: ContextValue;
}

interface State {
  size?: Size; // update only when children is function component
}

class ResizeConsumer extends React.PureComponent<Props, State> {
  state: State = {
    size: undefined,
  };

  private currentListenElement: HTMLElement | null = null;

  private get divProps() {
    return omit(this.props, [
      'innerRef',
      'onSizeChanged',
      'updateDatasetBySize',
      'children',
      'context',
    ]);
  }

  componentDidMount() {
    this.updateListener();
  }

  componentDidUpdate() {
    this.updateListener();
  }

  componentWillUnmount() {
    this.stopListen();
  }

  render() {
    const { size } = this.state;
    const { innerRef, children } = this.props;

    return (
      <div {...this.divProps} ref={innerRef}>
        {typeof children === 'function'
          ? (size && (children as FunctionComponent<Size>)(size))
          : children
        }
      </div>
    );
  }

  private updateAttribute = (size: Size) => {
    const element = this.props.innerRef.current;
    if (element && typeof this.props.updateDatasetBySize === 'function') {
      const newDataAttributes = this.props.updateDatasetBySize(size);
      updateElementDataAttributes(element, newDataAttributes);
    }
  };

  private onSizeChanged = (size: Size) => {
    if (typeof this.props.children === 'function') {
      this.setState({ size });
    }

    if (typeof this.props.onSizeChanged === 'function') {
      this.props.onSizeChanged(size);
    }

    this.updateAttribute(size);
  };

  private updateListener(
    nextListenElement: HTMLElement | null = this.props.context.listenElement,
  ) {
    if (this.currentListenElement !== nextListenElement) {
      this.startListenTo(nextListenElement);
    }
  }

  private startListenTo(element: HTMLElement | null) {
    this.stopListen();

    if (element) {
      Listener.shared.startListenTo(element, this.onSizeChanged);
      this.currentListenElement = element;
    }
  }

  private stopListen() {
    if (this.currentListenElement) {
      Listener.shared.stopListenTo(
        this.currentListenElement,
        this.onSizeChanged,
      );
    }
  }
}

export default ({ innerRef = React.createRef(), ...props }: ExternalProps) => (
  <Consumer>
    {(context) => (
      <ResizeConsumer
        {...props}
        context={context}
        innerRef={innerRef}
      />
    )}
  </Consumer>
);
