// @flow
import React, { Fragment } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MapLayerSettings from './map-layer-settings/MapLayerSettings';

type Props = {
    mapLayerList: Object[],
    onDragEnd: (DropResult) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    createNonSpatialFeature: () => void,
    activeAdminTool: string,
    createThemeLayer: (layerId: string) => void,
    toggleLayer: (layerId: string) => void,
    mapScale: number,
};

const MapLayersView = ({
    mapLayerList,
    onDragEnd,
    onOpacityChange,
    setActiveAdminTool,
    activeAdminTool,
    createNonSpatialFeature,
    createThemeLayer,
    toggleLayer,
    mapScale,
}: Props) => (
    <Fragment>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {dropProvided => (
                    <div ref={dropProvided.innerRef}>
                        {mapLayerList.map((l, i) => (
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
                                                layerList={mapLayerList}
                                                onOpacityChange={onOpacityChange}
                                                toggleLayer={toggleLayer}
                                                setActiveAdminTool={setActiveAdminTool}
                                                activeAdminTool={activeAdminTool}
                                                createNonSpatialFeature={createNonSpatialFeature}
                                                createThemeLayer={createThemeLayer}
                                                mapScale={mapScale}
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
