// @flow
import React, { Fragment } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import LayerSettings from '../../../../ui/blocks/LayerSettings';
import MapLayerTitle from '../../../shared/MapLayerTitle';

type Props = {
    layerList: Array<any>,
    onDragEnd: (DropResult) => void,
    onToggleVisibility: (Number) => void,
    onOpacityChange: (evt: Number, id: Number) => void,
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    activeAdminTool: string,
};

const MapLayersView = ({
    layerList,
    onDragEnd,
    onOpacityChange,
    onToggleVisibility,
    setActiveAdminTool,
    activeAdminTool,
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
                                            <LayerSettings
                                                toggledHidden={!l.visible}
                                            >
                                                <LayerSettings.Content>
                                                    <LayerSettings.Toggle
                                                        onClick={() =>
                                                            onToggleVisibility(l.id)
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                l.visible
                                                                    ? 'fas fa-toggle-on'
                                                                    : 'fas fa-toggle-off'
                                                            }
                                                        />
                                                    </LayerSettings.Toggle>
                                                    <LayerSettings.ContentMain>
                                                        <LayerSettings.ContentTop >
                                                            <LayerSettings.Title >
                                                                <MapLayerTitle layer={l} />
                                                            </LayerSettings.Title>
                                                            <LayerSettings.Icons
                                                                activeAdminTool={
                                                                    activeAdminTool === l.id
                                                                }
                                                            >
                                                                { l._source !== 'search' &&
                                                                !l.userLayer &&
                                                                l._source !== 'shapefile' &&
                                                                l.type === 'agfs' &&
                                                                <i
                                                                    role="button"
                                                                    tabIndex={0}
                                                                    onKeyPress={() =>
                                                                        setActiveAdminTool(
                                                                            l.id,
                                                                            layerList,
                                                                        )
                                                                    }
                                                                    onClick={() =>
                                                                        setActiveAdminTool(
                                                                            l.id,
                                                                            layerList,
                                                                        )
                                                                    }
                                                                    className="fas fa-edit"
                                                                />
                                                                }
                                                            </LayerSettings.Icons>
                                                        </LayerSettings.ContentTop>
                                                        <LayerSettings.Slider>
                                                            <Slider
                                                                min={0}
                                                                max={1}
                                                                step={0.01}
                                                                defaultValue={
                                                                    l.opacity
                                                                }
                                                                onChange={evt =>
                                                                    onOpacityChange(
                                                                        evt,
                                                                        l.id,
                                                                    )
                                                                }
                                                            />
                                                        </LayerSettings.Slider>
                                                    </LayerSettings.ContentMain>
                                                </LayerSettings.Content>
                                            </LayerSettings>
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
