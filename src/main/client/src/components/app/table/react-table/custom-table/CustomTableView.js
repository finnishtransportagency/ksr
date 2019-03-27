// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

type Props = {
    children: Object[],
    className: string,
};

const CustomTableView = ({ children, className, ...rest }: Props) => (
    <div className="rt-rtable" role="grid" {...rest}>
        <Scrollbars
            renderView={scrollProps => <div {...scrollProps} className="rtable-scroll-wrapper" />}
            renderTrackHorizontal={scrollProps => (
                <div {...scrollProps} className="track-horizontal" />
            )}
            renderTrackVertical={scrollProps => (
                <div {...scrollProps} className="track-vertical" />
            )}
        >
            {children[1]}
            {children[2]}
            {children[3]}
        </Scrollbars>
    </div>
);

export default CustomTableView;
