// @flow
import React, { Fragment } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MapLayerSettings from './map-layer-settings/MapLayerSettings';
import MapLayerParentChildView from './map-layer-parent-child/MapLayerParentChildView';

type Props = {
    mapLayerList: Object[],
    onDragEnd: (DropResult) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    createNonSpatialFeature: () => void,
    activeAdminTool: string,
    createThemeLayer: (layerId: string) => void,
    toggleLayer: (layerId: string) => void,
    mapScale: number,
    handleAdminModeChange: (layerId: string) => void,
    populateTable: (layer: Object) => void,
    loadingLayers: string[],
};

const MapLayersView = ({
    mapLayerList,
    onDragEnd,
    onOpacityChange,
    activeAdminTool,
    createNonSpatialFeature,
    createThemeLayer,
    toggleLayer,
    mapScale,
    handleAdminModeChange,
    populateTable,
    loadingLayers,
}: Props) => (
    <Fragment>
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {dropProvided => (
                    <div ref={dropProvided.innerRef}>
                        {mapLayerList
                            .map((l, i) => (
                                <Draggable key={l.id} draggableId={l.id} index={i}>
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {l.active
                                            && mapLayerList.some(a => a.parentLayer === l.id)
                                            && l._source !== 'search' && (
                                                <MapLayerParentChildView
                                                    layer={l}
                                                    layerList={mapLayerList}
                                                    onOpacityChange={onOpacityChange}
                                                    toggleLayer={toggleLayer}
                                                    activeAdminTool={activeAdminTool}
                                                    createThemeLayer={createThemeLayer}
                                                    mapScale={mapScale}
                                                    handleAdminModeChange={handleAdminModeChange}
                                                    populateTable={populateTable}
                                                    loadingLayers={loadingLayers}
                                                />
                                            )}
                                            {l.active
                                            && !l.parentLayer
                                            && (!mapLayerList.some(a => a.parentLayer === l.id)
                                                || l._source === 'search')
                                            && (
                                                <MapLayerSettings
                                                    layer={l}
                                                    layerList={mapLayerList}
                                                    onOpacityChange={onOpacityChange}
                                                    toggleLayer={toggleLayer}
                                                    activeAdminTool={activeAdminTool}
                                                    // eslint-disable-next-line max-len
                                                    createNonSpatialFeature={createNonSpatialFeature}
                                                    createThemeLayer={createThemeLayer}
                                                    mapScale={mapScale}
                                                    handleAdminModeChange={handleAdminModeChange}
                                                    populateTable={populateTable}
                                                    loadingLayers={loadingLayers}
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
