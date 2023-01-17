// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations/index';
import SketchUndoRedo from '../sketch-undo-redo/SketchUndoRedo';

type Props = {
    editSketchIcon: string,
    showAdminView: boolean,
    removeSketch: () => void,
    acceptSketch: () => void,
    drawNewFeatureButtonRef: () => void,
    drawNewAreaButtonRef: () => void,
    hasAdminGraphics: boolean,
    validGeometry: boolean,
    activeTool: string,
    showNewAreaButton: boolean,
    redo: () => void,
    undo: () => void,
    canRedo: boolean,
    canUndo: boolean,
};

function SketchActiveAdminView({
    editSketchIcon,
    showAdminView,
    removeSketch,
    acceptSketch,
    drawNewFeatureButtonRef,
    drawNewAreaButtonRef,
    hasAdminGraphics,
    validGeometry,
    activeTool,
    showNewAreaButton,
    redo,
    undo,
    canRedo,
    canUndo,
}: Props) {
    return (
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
                        acceptSketch();
                    } : null
                }
                onKeyPress={
                    hasAdminGraphics && validGeometry ? () => {
                        acceptSketch();
                    } : null
                }
            >
                <span className="esri-icon-check-mark" />
            </div>
            <div
                style={{ display: showNewAreaButton ? 'flex' : 'none' }}
                id="draw-create-new-feature"
                className={`esri-component esri-widget--button esri-widget esri-interactive ${validGeometry ? '' : 'disabled'}`}
                title={strings.sketchTool.newArea}
                ref={drawNewAreaButtonRef}
            >
                <span className="esri-icon-plus" />
            </div>
            <SketchUndoRedo
                redo={redo}
                undo={undo}
                canRedo={canRedo}
                canUndo={canUndo}
                show={hasAdminGraphics || activeTool === 'sketchActiveAdmin'}
            />
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
    );
}

export default SketchActiveAdminView;
