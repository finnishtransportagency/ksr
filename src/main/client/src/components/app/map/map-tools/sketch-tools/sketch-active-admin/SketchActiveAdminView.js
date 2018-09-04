// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations/index';
import Wrapper from './styles';

type Props = {
    editSketchIcon: string,
    activeAdminTool: string,
    removeSketch: () => void,
    drawNewFeatureButtonRef: () => void,
    tempGraphicsLayer: Object,
    setActiveModal: (modal: string) => void,
};

const SketchActiveAdminView = ({
    editSketchIcon,
    activeAdminTool,
    removeSketch,
    drawNewFeatureButtonRef,
    tempGraphicsLayer,
    setActiveModal,
}: Props) => (
    <Fragment>
        <div id="create-new-feature-wrapper">
            <div
                style={{ visibility: tempGraphicsLayer && tempGraphicsLayer.graphics && tempGraphicsLayer.graphics.length > 0 ? 'visible' : 'hidden' }}
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
                style={{ visibility: tempGraphicsLayer && tempGraphicsLayer.graphics && tempGraphicsLayer.graphics.length > 0 ? 'visible' : 'hidden' }}
                id="accept-create-new-feature"
                role="button"
                tabIndex={0}
                className="esri-component esri-widget--button esri-widget esri-interactive"
                title={strings.sketchTool.acceptSelection}
                onClick={
                    tempGraphicsLayer &&
                    tempGraphicsLayer.graphics &&
                    tempGraphicsLayer.graphics.length > 0 ? () => {
                            setActiveModal('editLayerDetails');
                        } : null}
                onKeyPress={
                    tempGraphicsLayer &&
                    tempGraphicsLayer.graphics &&
                    tempGraphicsLayer.graphics.length > 0 ? () => {
                            setActiveModal('editLayerDetails');
                        } : null}
            >
                <span className="esri-icon-check-mark" />
            </div>
            <Wrapper>
                <div
                    style={{ visibility: activeAdminTool === '' ? 'hidden' : 'visible' }}
                    id="draw-create-new-feature"
                    className={`esri-component esri-widget--button esri-widget esri-interactive ${tempGraphicsLayer && tempGraphicsLayer.graphics && tempGraphicsLayer.graphics.length > 0 ? 'draw-create-new-feature-disabled' : ''}`}
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
