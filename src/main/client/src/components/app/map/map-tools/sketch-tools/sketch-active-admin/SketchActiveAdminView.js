// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations/index';

type Props = {
    editSketchIcon: string,
    showAdminView: boolean,
    removeSketch: () => void,
    drawNewFeatureButtonRef: () => void,
    hasAdminGraphics: boolean,
    setActiveModal: (editModeActive: boolean) => void,
    editModeActive: boolean,
    validGeometry: boolean,
    activeTool: string,
};

const SketchActiveAdminView = ({
    editSketchIcon,
    showAdminView,
    removeSketch,
    drawNewFeatureButtonRef,
    hasAdminGraphics,
    setActiveModal,
    editModeActive,
    validGeometry,
    activeTool,
}: Props) => (
    <Fragment>
        <div id="create-new-feature-wrapper">
            <div
                style={{ visibility: hasAdminGraphics ? 'visible' : 'hidden' }}
                id="reject-create-new-feature"
                role="button"
                tabIndex={0}
                className="esri-component esri-widget--button esri-widget esri-interactive"
                title={strings.sketchTool.rejectSelection}
                onClick={removeSketch}
                onKeyPress={removeSketch}
            >
                <span className="esri-icon-close" />
            </div>
            <div
                style={{ visibility: hasAdminGraphics ? 'visible' : 'hidden' }}
                id="accept-create-new-feature"
                role="button"
                tabIndex={0}
                className={`esri-component esri-widget--button esri-widget esri-interactive ${validGeometry ? '' : 'disabled'}`}
                title={strings.sketchTool.acceptSelection}
                onClick={
                    hasAdminGraphics && validGeometry ? () => {
                        setActiveModal(editModeActive);
                    } : null}
                onKeyPress={
                    hasAdminGraphics && validGeometry ? () => {
                        setActiveModal(editModeActive);
                    } : null}
            >
                <span className="esri-icon-check-mark" />
            </div>
            <div
                style={{ visibility: showAdminView ? 'visible' : 'hidden' }}
                id="draw-create-new-feature"
                className={`esri-component esri-widget--button esri-widget esri-interactive ${hasAdminGraphics || (activeTool && activeTool !== 'sketchActiveAdmin') ? 'disabled' : ''}`}
                title={strings.sketchTool.activeAdmin}
                ref={drawNewFeatureButtonRef}
            >
                <span className={`esri-icon-${editSketchIcon}`} />
            </div>
        </div>
    </Fragment>
);

export default SketchActiveAdminView;
