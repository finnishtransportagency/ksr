// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

type Props = {
    children: Object[],
    style: any,
};

const customTableStyle = {
    minWidth: 'fit-content',
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
            <div style={customTableStyle}>
                {children[1]}
                {children[2]}
                {children[3]}
            </div>
        </Scrollbars>
    </div>
);

export default CustomTableView;
