// @flow
import React, { Fragment } from 'react';
import { MapLayerTitleWrapper, Icon, Text } from './styles';
import { colorBackgroundGrey } from '../../ui/defaultStyles';

type Props = {
    layer: Object,
    showLayerGroup?: boolean,
    childLayer?: boolean,
};

function MapLayerTitle({ layer, showLayerGroup, childLayer }: Props) {
    let iconClass = '';
    switch (layer._source) {
        case 'search': {
            iconClass = 'fas fa-search';
            break;
        }
        case 'shapefile': {
            iconClass = 'far fa-file';
            break;
        }
        default:
            if (layer.userLayer) {
                iconClass = 'fas fa-user';
                break;
            } else if (layer.type === 'agfl') {
                iconClass = 'fas fa-table';
                break;
            }
    }

    return (
        <>
            <MapLayerTitleWrapper>
                {
                    iconClass
                    && (
                        <Icon>
                            <i className={iconClass} />
                        </Icon>
                    )
                }
                <Text title={layer.name ? layer.name : layer.title}>
                    <span>{layer.name ? layer.name : layer.title}</span>
                </Text>
            </MapLayerTitleWrapper>
            {
                showLayerGroup
                && (
                    <MapLayerTitleWrapper color={colorBackgroundGrey} showLayerGroup childLayer>
                        <Text title={layer.layerGroupName}>
                            <span>{layer.layerGroupName}</span>
                        </Text>
                    </MapLayerTitleWrapper>
                )
            }
            {childLayer && <div style={{ height: '8px' }} />}
        </>
    );
}

MapLayerTitle.defaultProps = {
    showLayerGroup: false,
    childLayer: false,
};

export default MapLayerTitle;
