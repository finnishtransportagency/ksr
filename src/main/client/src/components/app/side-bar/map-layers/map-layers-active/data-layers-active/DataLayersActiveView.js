// @flow
import React, { Fragment } from 'react';
import MapLayerSettings from '../map-layer-settings/MapLayerSettings';

type Props = {
    dataLayerList: Object[],
    createNonSpatialFeature: () => void,
    activeAdminTool: string,
    mapScale: number,
    handleAdminModeChange: (layerId: string) => void,
    addNonSpatialContentToTable: (layer: Object) => void,
    tableLayers: Object[],
};

const DataLayersActiveView = ({
    dataLayerList,
    activeAdminTool,
    createNonSpatialFeature,
    mapScale,
    handleAdminModeChange,
    addNonSpatialContentToTable,
    tableLayers,
}: Props) => {
    if (dataLayerList.length === 0) return null;
    return (
        <Fragment>
            <br />
            {
                dataLayerList.map(l => (
                    <MapLayerSettings
                        key={l.id}
                        layer={l}
                        layerList={dataLayerList}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                        onOpacityChange={() => {}}
                        onToggleVisibility={() => {}}
                        createThemeLayer={() => {}}
                        toggleLayer={() => {}}
                        mapScale={mapScale}
                        handleAdminModeChange={handleAdminModeChange}
                        addNonSpatialContentToTable={addNonSpatialContentToTable}
                        tableLayers={tableLayers}
                    />
                ))
            }
        </Fragment>
    );
};

export default DataLayersActiveView;
