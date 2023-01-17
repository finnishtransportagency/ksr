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

function SketchUndoRedo({
    redo,
    undo,
    canRedo,
    canUndo,
    show,
}: Props) {
    return (
        <>
            <div
                style={{ visibility: show ? 'visible' : 'hidden' }}
                id="undo-new-feature"
                role="button"
                tabIndex={0}
                className={`esri-component esri-widget--button esri-widget esri-interactive ${canUndo ? '' : 'disabled'}`}
                title={strings.sketchTool.undo}
                onClick={canUndo ? undo : undefined}
                onKeyPress={canUndo
                    ? (ev) => {
                        switch (ev.key) {
                            case 'z':
                            case 'Enter':
                                undo(ev);
                                break;
                            case 'r':
                                redo(ev);
                                break;
                            default:
                                break;
                        }
                    }
                    : undefined}
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
                onKeyPress={canUndo
                    ? (ev) => {
                        switch (ev.key) {
                            case 'z':
                                undo(ev);
                                break;
                            case 'r':
                            case 'Enter':
                                redo(ev);
                                break;
                            default:
                                break;
                        }
                    }
                    : undefined}
            >
                <span className="esri-icon-redo" />
            </div>
        </>
    );
}

export default SketchUndoRedo;
