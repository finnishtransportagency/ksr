// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

type Props = {
    children: Object[],
    style: any,
};

const CustomTableView = ({ children, style }: Props) => (
    <div className="rt-rtable" role="grid" {...style}>
        <Scrollbars
            renderView={scrollProps => <div {...scrollProps} className="rtable-scroll-wrapper" />}
            renderTrackHorizontal={scrollProps => (
                <div {...scrollProps} className="track-horizontal" />
            )}
            renderTrackVertical={scrollProps => (
                <div {...scrollProps} className="track-vertical" />
            )}
        >
            <div>
                {children[1]}
                {children[2]}
                {children[3]}
            </div>
        </Scrollbars>
    </div>
);

export default CustomTableView;
