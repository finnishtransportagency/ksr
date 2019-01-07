// @flow
import React, { Fragment } from 'react';
import MapLayerSettings from '../map-layer-settings/MapLayerSettings';

type Props = {
    dataLayerList: Object[],
    setActiveAdminTool: (layerId: string, layerList: Array<any>) => void,
    createNonSpatialFeature: () => void,
    activeAdminTool: string,
};

const DataLayersActiveView = ({
    dataLayerList,
    setActiveAdminTool,
    activeAdminTool,
    createNonSpatialFeature,
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
                        setActiveAdminTool={setActiveAdminTool}
                        activeAdminTool={activeAdminTool}
                        createNonSpatialFeature={createNonSpatialFeature}
                        onOpacityChange={() => {}}
                        onToggleVisibility={() => {}}
                        createThemeLayer={() => {}}
                    />
                ))
            }
        </Fragment>
    );
};

export default DataLayersActiveView;
