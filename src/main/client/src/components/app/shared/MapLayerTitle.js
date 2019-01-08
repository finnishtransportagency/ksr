// @flow
import React, { Fragment } from 'react';
import { MapLayerTitleWrapper, Icon, Text } from './styles';
import { colorBackgroundGrey } from '../../ui/defaultStyles';

type Props = {
    layer: Object,
    showLayerGroup?: boolean,
};

const MapLayerTitle = ({ layer, showLayerGroup }: Props) => {
    switch (layer._source) {
        case 'search': {
            return (
                <Fragment>
                    <MapLayerTitleWrapper>
                        <Icon>
                            <i className="fas fa-search" />
                        </Icon>
                        <Text>
                            <span>{layer.name ? layer.name : layer.title}</span>
                        </Text>
                    </MapLayerTitleWrapper>
                    {showLayerGroup &&
                    <MapLayerTitleWrapper color={colorBackgroundGrey} showLayerGroup>
                        <Icon />
                        <Text>
                            <span>{layer.layerGroupName}</span>
                        </Text>
                    </MapLayerTitleWrapper>
                    }
                </Fragment>
            );
        }
        case 'shapefile': {
            return (
                <Fragment>
                    <MapLayerTitleWrapper>
                        <Icon>
                            <i className="far fa-file" />
                        </Icon>
                        <Text>
                            <span>{layer.name ? layer.name : layer.title}</span>
                        </Text>
                    </MapLayerTitleWrapper>
                    {showLayerGroup &&
                    <MapLayerTitleWrapper color={colorBackgroundGrey} showLayerGroup>
                        <Icon />
                        <Text>
                            <span>{layer.layerGroupName}</span>
                        </Text>
                    </MapLayerTitleWrapper>
                    }
                </Fragment>
            );
        }
        default:
            if (layer.userLayer) {
                return (
                    <Fragment>
                        <MapLayerTitleWrapper>
                            <Icon>
                                <i className="fas fa-user" />
                            </Icon>
                            <Text>
                                <span>{layer.name ? layer.name : layer.title}</span>
                            </Text>
                        </MapLayerTitleWrapper>
                        {showLayerGroup &&
                        <MapLayerTitleWrapper color={colorBackgroundGrey} showLayerGroup>
                            <Icon />
                            <Text>
                                <span>{layer.layerGroupName}</span>
                            </Text>
                        </MapLayerTitleWrapper>
                        }
                    </Fragment>
                );
            } else if (layer.type === 'agfl') {
                return (
                    <Fragment>
                        <MapLayerTitleWrapper>
                            <Icon>
                                <i className="fas fa-table" />
                            </Icon>
                            <Text>
                                <span>{layer.name ? layer.name : layer.title}</span>
                            </Text>
                        </MapLayerTitleWrapper>
                        {showLayerGroup &&
                        <MapLayerTitleWrapper color={colorBackgroundGrey} showLayerGroup>
                            <Icon />
                            <Text>
                                <span>{layer.layerGroupName}</span>
                            </Text>
                        </MapLayerTitleWrapper>
                        }
                    </Fragment>
                );
            }
            return (
                <Fragment>
                    <MapLayerTitleWrapper>
                        <Text>
                            <span>{layer.name ? layer.name : layer.title}</span>
                        </Text>
                    </MapLayerTitleWrapper>
                    {showLayerGroup &&
                    <MapLayerTitleWrapper color={colorBackgroundGrey} showLayerGroup>
                        <Text>
                            <span>{layer.layerGroupName}</span>
                        </Text>
                    </MapLayerTitleWrapper>
                    }
                </Fragment>
            );
    }
};

export default MapLayerTitle;
