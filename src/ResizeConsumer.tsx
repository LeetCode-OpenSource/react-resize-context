import * as React from 'react';
import { omit } from 'lodash';

import { HTMLAttributes, ReactNode, RefObject, FunctionComponent } from 'react';

import { Consumer, ContextValue } from './context';
import { updateElementDataAttributes, isWidthChanged, isHeightChanged } from './methods';

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

class ResizeConsumer extends React.PureComponent<Props> {
  private get divProps() {
    return omit(this.props, [
      'innerRef',
      'onSizeChanged',
      'updateDatasetBySize',
      'children',
      'context',
    ]);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      isWidthChanged(prevProps.context.size, this.props.context.size) ||
      isHeightChanged(prevProps.context.size, this.props.context.size)
    ) {
      this.onSizeChanged()
    }
  }

  render() {
    const { innerRef, children, context: { size } } = this.props;

    return (
      <div {...this.divProps} ref={innerRef}>
        {typeof children === 'function'
          ? (size && (children as FunctionComponent<Size>)(size))
          : children
        }
      </div>
    );
  }

  private onSizeChanged = () => {
    const { size } = this.props.context;

    if (size) {
      if (typeof this.props.onSizeChanged === 'function') {
        this.props.onSizeChanged(size);
      }

      this.updateAttribute(size);
    }
  };

  private updateAttribute = (size: Size) => {
    const element = this.props.innerRef.current;
    if (element && typeof this.props.updateDatasetBySize === 'function') {
      const newDataAttributes = this.props.updateDatasetBySize(size);
      updateElementDataAttributes(element, newDataAttributes);
    }
  };
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
