// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations/index';
import Wrapper from './styles';

type Props = {
    editSketchIcon: string,
    showAdminView: boolean,
    removeSketch: () => void,
    drawNewFeatureButtonRef: () => void,
    hasAdminGraphics: boolean,
    setActiveModal: (modal: string) => void,
};

const SketchActiveAdminView = ({
    editSketchIcon,
    showAdminView,
    removeSketch,
    drawNewFeatureButtonRef,
    hasAdminGraphics,
    setActiveModal,
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
                className="esri-component esri-widget--button esri-widget esri-interactive"
                title={strings.sketchTool.acceptSelection}
                onClick={
                    hasAdminGraphics ? () => {
                        setActiveModal('editLayerDetails');
                    } : null}
                onKeyPress={
                    hasAdminGraphics ? () => {
                        setActiveModal('editLayerDetails');
                    } : null}
            >
                <span className="esri-icon-check-mark" />
            </div>
            <Wrapper>
                <div
                    style={{ visibility: showAdminView ? 'visible' : 'hidden' }}
                    id="draw-create-new-feature"
                    className={`esri-component esri-widget--button esri-widget esri-interactive ${hasAdminGraphics ? 'draw-create-new-feature-disabled' : ''}`}
                    title={strings.sketchTool.activeAdmin}
                    ref={drawNewFeatureButtonRef}
                >
                    <span className={`esri-icon-${editSketchIcon}`} />
                </div>
            </Wrapper>
        </div>
    </Fragment>
);

export default SketchActiveAdminView;
