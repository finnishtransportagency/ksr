// flow-typed signature: 7a1f2db09f1e8a40d686f3e56d9112ac
// flow-typed version: c6154227d1/react-custom-scrollbars_v4.2.x/flow_>=v0.104.x

declare module 'react-custom-scrollbars' {
  declare type PositionValues = {
    top: number,
    left: number,
    clientWidth: number,
    clientHeight: number,
    scrollWidth: number,
    scrollHeight: number,
    scrollLeft: number,
    scrollTop: number,
    ...
  };

  declare type Props = {
    onScroll?: (event: SyntheticUIEvent<*>) => void,
    onScrollFrame?: (values: PositionValues) => void,
    onScrollStart?: () => void,
    onScrollStop?: () => void,
    onUpdate?: (values: PositionValues) => void,
    renderView?: React$StatelessFunctionalComponent<any>,
    renderTrackHorizontal?: React$StatelessFunctionalComponent<any>,
    renderTrackVertical?: React$StatelessFunctionalComponent<any>,
    renderThumbHorizontal?: React$StatelessFunctionalComponent<any>,
    renderThumbVertical?: React$StatelessFunctionalComponent<any>,
    hideTracksWhenNotNeeded?: boolean,
    autoHide?: boolean,
    autoHideTimeout?: number,
    autoHideDuration?: number,
    thumbSize?: number,
    thumbMinSize?: number,
    universal?: boolean,
    autoHeight?: boolean,
    autoHeightMin?: number | string,
    autoHeightMax?: number | string,
    ...
  };

  declare export default class Scrollbars extends React$Component<Props> {
    scrollTop(top: number): void;
    scrollLeft(left: number): void;
    scrollToTop(): void;
    scrollToBottom(): void;
    scrollToLeft(): void;
    scrollToRight(): void;
    getScrollLeft(): number;
    getScrollTop(): number;
    getScrollWidth(): number;
    getScrollHeight(): number;
    getClientWidth(): number;
    getClientHeight(): number;
    getValues(): PositionValues;
  }
}
