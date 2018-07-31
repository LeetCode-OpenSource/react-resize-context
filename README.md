# react-resize-context

[![npm version](https://badge.fury.io/js/react-resize-context.svg)](https://www.npmjs.com/package/react-resize-context)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/LeetCode-OpenSource/react-resize-context/pulls)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)

A high performance React component for responding to resize event.

### Install
```bash
npm install react-resize-context
```

## Examples
* [A simple example](https://codesandbox.io/embed/jjjmp4z6yy)
* [Multiple components listen resize event from the same parent element](https://codesandbox.io/embed/vnz20v4j65)

## APIs
Provides a `{ ResizeProvider, ResizeConsumer }` pair which just like React's [Context API](https://reactjs.org/docs/context.html). When renders a context `ResizeConsumer`, it will listen to the resize event from the [children](https://reactjs.org/docs/jsx-in-depth.html#children-in-jsx) of closest matching `ResizeProvider` above it in the tree.

### \<ResizeProvider \/\>
> A React component that allows `ResizeConsumer` to listen to the resize event from `ResizeProvider`'s children element.

### \<ResizeConsumer \/\>
> It is also a React component that triggers two callback functions when the element is resized. One is `onSizeChanged` and the other is `updateDatasetBySize`.
```typescript
interface Size {
  width: number;
  height: number;
}

interface DOMStringMap {
    [name: string]: string | undefined;
}

type onSizeChanged =  (size: Size) => void;
type updateDatasetBySize = (size: Size) => DOMStringMap;
```

#### About `updateDatasetBySize`
The return value of `updateDatasetBySize` is updated to the [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) of the current ResizeConsumer's DOM element, so we can easily update the styles of different sizes through the CSS attribute selectors (eg: `[data-size="small"]`).
