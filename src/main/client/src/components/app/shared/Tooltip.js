// @flow
import React from 'react';
import { createPortal } from 'react-dom';
import ReactTooltip from 'react-tooltip';
import { TooltipChildrenWrapper } from './styles';

type Props = {
    id: string,
    children: React$Node,
    place?: string,
    clickable?: boolean,
    eventOff?: string,
    effect?: string,
};

const tooltipRoot: any = document.getElementById('tooltip-root');

const Tooltip = (props: Props): any => {
    const {
        id, children, place, effect, clickable, eventOff,
    } = props;
    return createPortal(
        <ReactTooltip
            id={id}
            place={place || 'right'}
            effect={effect || 'solid'}
            backgroundColor="white"
            textColor="black"
            clickable={clickable !== undefined ? clickable : true}
            globalEventOff={eventOff || 'click'}
        >
            <TooltipChildrenWrapper>
                {children}
            </TooltipChildrenWrapper>
        </ReactTooltip>,
        tooltipRoot,
    );
};

export default Tooltip;
