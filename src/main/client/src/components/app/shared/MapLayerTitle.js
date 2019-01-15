// @flow
import React, { Fragment } from 'react';
import { MapLayerTitleWrapper, Icon, Text } from './styles';
import { colorBackgroundGrey } from '../../ui/defaultStyles';

type Props = {
    layer: Object,
    showLayerGroup?: boolean,
};

const MapLayerTitle = ({ layer, showLayerGroup }: Props) => {
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
        <Fragment>
            <MapLayerTitleWrapper>
                {
                    iconClass &&
                    <Icon>
                        <i className={iconClass} />
                    </Icon>
                }
                <Text>
                    <span>{layer.name ? layer.name : layer.title}</span>
                </Text>
            </MapLayerTitleWrapper>
            {
                showLayerGroup &&
                <MapLayerTitleWrapper color={colorBackgroundGrey} showLayerGroup>
                    <Text>
                        <span>{layer.layerGroupName}</span>
                    </Text>
                </MapLayerTitleWrapper>
            }
        </Fragment>
    );
};

MapLayerTitle.defaultProps = {
    showLayerGroup: false,
};

export default MapLayerTitle;
