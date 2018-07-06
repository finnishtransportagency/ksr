// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import CustomTableWrapper from './styles';

type Props = {
    children: Array<any>,
    className: string,
};

const CustomTableView = ({ children, className, ...rest }: Props) => (
    <CustomTableWrapper className="rt-rtable" role="grid" {...rest} >
        <Scrollbars
            autoHide
            renderView={scrollProps => <div {...scrollProps} className="rtable-scroll-wrapper" />}
            renderTrackVertical={scrollProps =>
                <div {...scrollProps} className="track-vertical" style={{ display: 'none' }} />}
            renderThumbVertical={scrollProps =>
                <div {...scrollProps} className="thumb-vertical" style={{ display: 'none' }} />}
        >
            {children[1]}
            {children[2]}
            {children[3]}
        </Scrollbars>
    </CustomTableWrapper>
);

export default CustomTableView;
