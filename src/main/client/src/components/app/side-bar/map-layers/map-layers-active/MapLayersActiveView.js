// @flow
import React, { Fragment } from 'react';
import LayerSettings from '../../../../ui/blocks/LayerSettings';

type Props = {
    activeLayers: Array<any>,
};

const MapLayersView = ({ activeLayers }: Props) => (
    <Fragment>
        {activeLayers.map(lg => (
            lg.map(l => (
                <LayerSettings>
                    <LayerSettings.Drag>
                        <i className="fas fa-arrows-alt-v" />
                    </LayerSettings.Drag>
                    <LayerSettings.Content>
                        <LayerSettings.Toggle>
                            <i className="fas fa-toggle-on" />
                        </LayerSettings.Toggle>
                        <LayerSettings.ContentMain>
                            <LayerSettings.ContentTop>
                                <LayerSettings.Title>
                                    {l.name}
                                </LayerSettings.Title>
                                <LayerSettings.Icons>
                                    <i className="fas fa-edit" />
                                </LayerSettings.Icons>
                            </LayerSettings.ContentTop>
                            <LayerSettings.Slider>
                                <hr />
                            </LayerSettings.Slider>
                        </LayerSettings.ContentMain>
                    </LayerSettings.Content>
                </LayerSettings>
            ))
        ))}
    </Fragment>
);

export default MapLayersView;
