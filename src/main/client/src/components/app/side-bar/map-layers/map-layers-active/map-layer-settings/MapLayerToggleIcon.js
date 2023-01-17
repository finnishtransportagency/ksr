// @flow
import React from 'react';

type Props = {
    visible: boolean,
};

function MapLayerToggleIcon({ visible }: Props) {
    return <i className={visible ? 'fas fa-toggle-on' : 'fas fa-toggle-off'} />;
}

export default MapLayerToggleIcon;
