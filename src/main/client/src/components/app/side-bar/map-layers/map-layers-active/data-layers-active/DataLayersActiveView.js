// @flow
import React, { Fragment } from 'react';
import MapLayerSettings from '../map-layer-settings/MapLayerSettings';

type Props = {
    dataLayerList: Object[],
    createNonSpatialFeature: () => void,
    activeAdminTool: string,
    mapScale: number,
    handleAdminModeChange: (layerId: string) => void,
};

const DataLayersActiveView = ({
    dataLayerList,
    activeAdminTool,
    createNonSpatialFeature,
    mapScale,
    handleAdminModeChange,
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
                    />
                ))
            }
        </Fragment>
    );
};

export default DataLayersActiveView;
