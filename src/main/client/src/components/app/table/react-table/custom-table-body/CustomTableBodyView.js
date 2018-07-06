// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import CustomTableBodyWrapper from './styles';

type Props = {
    children: any,
};

const CustomTableBodyView = (props: Props) => (
    <CustomTableBodyWrapper {...props} className="rt-tbody" >
        <Scrollbars
            autoHide
            renderView={scrollProps => <div {...scrollProps} className="tbody-scroll-wrapper" />}
            renderTrackHorizontal={scrollProps =>
                <div {...scrollProps} className="track-horizontal" style={{ display: 'none' }} />}
            renderThumbHorizontal={scrollProps =>
                <div {...scrollProps} className="thumb-horizontal" style={{ display: 'none' }} />}
        >
            {props.children}
        </Scrollbars>
    </CustomTableBodyWrapper>
);

export default CustomTableBodyView;
