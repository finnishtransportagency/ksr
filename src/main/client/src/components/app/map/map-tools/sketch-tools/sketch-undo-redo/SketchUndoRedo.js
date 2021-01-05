// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../../translations';

type Props = {
    redo: () => void,
    undo: () => void,
    canRedo: boolean,
    canUndo: boolean,
    show: boolean,
};

const SketchUndoRedo = ({
    redo,
    undo,
    canRedo,
    canUndo,
    show,
}: Props) => (
    <Fragment>
        <div
            style={{ visibility: show ? 'visible' : 'hidden' }}
            id="undo-new-feature"
            role="button"
            tabIndex={0}
            className={`esri-component esri-widget--button esri-widget esri-interactive ${canUndo ? '' : 'disabled'}`}
            title={strings.sketchTool.undo}
            onClick={canUndo ? undo : undefined}
            onKeyPress={canUndo ? undo : undefined}
        >
            <span className="esri-icon-undo" />
        </div>
        <div
            style={{ visibility: show ? 'visible' : 'hidden' }}
            id="redo-new-feature"
            role="button"
            tabIndex={0}
            className={`esri-component esri-widget--button esri-widget esri-interactive ${canRedo ? '' : 'disabled'}`}
            title={strings.sketchTool.redo}
            onClick={canRedo ? redo : undefined}
            onKeyPress={canRedo ? redo : undefined}
        >
            <span className="esri-icon-redo" />
        </div>
    </Fragment>
);

export default SketchUndoRedo;
