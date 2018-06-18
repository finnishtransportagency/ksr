// @flow
import React, { Fragment } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LayerSettings from '../../../../ui/blocks/LayerSettings';

type Props = {
    activeLayers: Array<any>,
    onDragEnd: (DropResult) => void,
    onToggleVisibility: (Number) => void,
};

const MapLayersView = ({ activeLayers, onDragEnd, onToggleVisibility }: Props) => (
    <Fragment>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {dropProvided => (
                    <div ref={dropProvided.innerRef}>
                        {activeLayers.map((l, i) => (
                            <Draggable key={l.id} draggableId={l.id} index={i}>
                                {provided => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <LayerSettings toggledHidden={!l.visible}>
                                            <LayerSettings.Content>
                                                <LayerSettings.Toggle onClick={() => onToggleVisibility(l.id)}>
                                                    <i className={l.visible ? 'fas fa-toggle-on' : 'fas fa-toggle-off'} />
                                                </LayerSettings.Toggle>
                                                <LayerSettings.ContentMain>
                                                    <LayerSettings.ContentTop>
                                                        <LayerSettings.Title>
                                                            {l.name}
                                                        </LayerSettings.Title>
                                                        <LayerSettings.Icons>
                                                            <i className="fas fa-edit" />
                                                        </LayerSettings.Icons>
                                                    </LayerSettings.ContentTop>
                                                    <LayerSettings.Slider>
                                                        <hr />
                                                    </LayerSettings.Slider>
                                                </LayerSettings.ContentMain>
                                            </LayerSettings.Content>
                                        </LayerSettings>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    </Fragment>
);

export default MapLayersView;
