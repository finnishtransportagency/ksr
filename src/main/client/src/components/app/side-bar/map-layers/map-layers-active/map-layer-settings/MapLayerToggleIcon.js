// @flow
import React from 'react';

type Props = {
    visible: boolean,
};

const MapLayerToggleIcon = ({ visible }: Props) => (
    <i className={visible ? 'fas fa-toggle-on' : 'fas fa-toggle-off'} />
);

export default MapLayerToggleIcon;
