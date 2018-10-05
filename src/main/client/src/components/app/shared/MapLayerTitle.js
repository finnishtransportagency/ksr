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
        case 'shapefile': {
            return (
                <MapLayerTitleWrapper>
                    <i className="far fa-file" />
                    <span>{layer.name ? layer.name : layer.title}</span>
                </MapLayerTitleWrapper>
            );
        }
        default:
            if (layer.userLayer) {
                return (
                    <MapLayerTitleWrapper>
                        <i className="fas fa-user" />
                        <span>{layer.name ? layer.name : layer.title}</span>
                    </MapLayerTitleWrapper>
                );
            } else if (layer.type === 'agfl') {
                return (
                    <MapLayerTitleWrapper>
                        <i className="fas fa-table" />
                        <span>{layer.name ? layer.name : layer.title}</span>
                    </MapLayerTitleWrapper>
                );
            }
            return layer.name ? layer.name : layer.title;
    }
};

export default MapLayerTitle;
