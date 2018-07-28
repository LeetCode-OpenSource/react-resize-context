import * as PropTypes from 'prop-types';
import * as React from 'react';
import { omit } from 'lodash';

import { HTMLAttributes, RefObject } from 'react';

import { Consumer, ContextValue } from './context';
import Listener from './Listener';
import { isRefObject, updateElementDataAttributes } from './methods';

import { Size } from './types';

interface ForwardRefProps extends HTMLAttributes<HTMLDivElement> {
  onSizeChanged?: (size: Size) => void;
  updateDatasetBySize?: (size: Size) => DOMStringMap;
}

interface Props extends ForwardRefProps {
  context: ContextValue;
  forwardedRef: RefObject<HTMLDivElement>;
}

class ResizeConsumer extends React.PureComponent<Props> {
  private currentListenElement: HTMLElement | null = null;

  private get divProps() {
    return omit(this.props, [
      'context',
      'forwardedRef',
      'onSizeChanged',
      'updateDatasetBySize',
    ]);
  }

  public componentDidMount() {
    this.updateListener();
  }

  public componentDidUpdate() {
    this.updateListener();
  }

  public componentWillUnmount() {
    this.stopListen();
  }

  public render() {
    return (
      <div {...this.divProps} ref={this.props.forwardedRef}>
        {this.props.children}
      </div>
    );
  }

  private updateAttribute = (size: Size) => {
    const element = this.props.forwardedRef.current;
    if (element && typeof this.props.updateDatasetBySize === 'function') {
      const newDataAttributes = this.props.updateDatasetBySize(size);
      updateElementDataAttributes(element, newDataAttributes);
    }
  };

  private onSizeChanged = (size: Size) => {
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

const ForwardRef = React.forwardRef<HTMLDivElement, ForwardRefProps>(
  (props, ref) => (
    <Consumer>
      {(context) => (
        <ResizeConsumer
          {...props}
          context={context}
          forwardedRef={
            isRefObject(ref)
              ? (ref as RefObject<HTMLDivElement>)
              : React.createRef()
          }
        />
      )}
    </Consumer>
  ),
);

ForwardRef.propTypes = {
  onSizeChanged: PropTypes.func,
  updateDatasetBySize: PropTypes.func,
};

ForwardRef.defaultProps = {
  onSizeChanged: undefined,
  updateDatasetBySize: undefined,
};

export default ForwardRef;
