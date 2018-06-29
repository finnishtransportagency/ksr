// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations';

type Props = {
    removeSelection: () => void,
    buttonVisibilityRef: () => void,
    drawRectangleButtonRef: () => void,
};

const SketchToolView = ({
    removeSelection,
    buttonVisibilityRef,
    drawRectangleButtonRef,
}: Props) => (
    <Fragment>
        <div
            id="draw-rectangle"
            className="esri-widget-button esri-widget esri-interactive"
            title={strings.SketchTool.drawRectangle}
            ref={drawRectangleButtonRef}
        >
            <span className="esri-icon-checkbox-unchecked" />
        </div>
        <div
            id="remove-selection"
            role="button"
            tabIndex={0}
            ref={buttonVisibilityRef}
            className="esri-widget-button esri-widget esri-interactive"
            title={strings.SketchTool.removeSelection}
            onClick={removeSelection}
            onKeyPress={removeSelection}
        >
            <span className="esri-icon-close" />
        </div>
    </Fragment>
);

export default SketchToolView;
