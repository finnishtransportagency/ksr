// @flow
import React, { Fragment } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MapLayerSettings from './map-layer-settings/MapLayerSettings';

type Props = {
    layerList: Object[],
    onDragEnd: (DropResult) => void,
    onToggleVisibility: (Number) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    createNonSpatialFeature: (layerId: string) => void,
    activeAdminTool: string,
};

const MapLayersView = ({
    layerList,
    onDragEnd,
    onOpacityChange,
    onToggleVisibility,
    setActiveAdminTool,
    activeAdminTool,
    createNonSpatialFeature,
}: Props) => (
    <Fragment>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {dropProvided => (
                    <div ref={dropProvided.innerRef}>
                        {layerList.map((l, i) => (
                            <Draggable key={l.id} draggableId={l.id} index={i}>
                                {provided => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        {l.active && (
                                            <MapLayerSettings
                                                layer={l}
                                                layerList={layerList}
                                                onOpacityChange={onOpacityChange}
                                                onToggleVisibility={onToggleVisibility}
                                                setActiveAdminTool={setActiveAdminTool}
                                                activeAdminTool={activeAdminTool}
                                                createNonSpatialFeature={createNonSpatialFeature}
                                            />
                                        )}
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
