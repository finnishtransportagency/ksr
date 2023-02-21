/* eslint-disable react/require-default-props */
// @flow
import React, { Fragment } from 'react';
import MapLayerSettings from '../map-layer-settings/MapLayerSettings';

type Props = {
    dataLayerList: Object[],
    createNonSpatialFeature: () => void,
    activeAdminTool: string,
    mapScale: number,
    handleAdminModeChange: (layerId: string) => void,
    addNonSpatialContentToTable?: (layer: Object) => void,
    tableLayers?: Object[],
};

function DataLayersActiveView({
    dataLayerList,
    activeAdminTool,
    createNonSpatialFeature,
    mapScale,
    handleAdminModeChange,
    addNonSpatialContentToTable,
    tableLayers,
}: Props): any {
    if (dataLayerList.length === 0) return null;
    return (
        <>
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
        </>
    );
}

export default DataLayersActiveView;
