import React from 'react';
import { MapLayerTitleWrapper } from './styles';

const MapLayerTitle = ({ layer }) => {
    switch (layer._source) {
        case 'search': {
            return (
                <MapLayerTitleWrapper>
                    <i className="fas fa-search" />
                    <span>{layer.name ? layer.name : layer.title}</span>
                </MapLayerTitleWrapper>
            );
        }
        default:
            return layer.name ? layer.name : layer.title;
    }
};

export default MapLayerTitle;