// @flow
import React, { Component } from 'react';
import EsriMapView from './EsriMapView';

type Props = {
    activeNav: string,
};

type State = {
    options: {
        zoom: number,
        container: string,
        basemap: string,
        extentData: {
            xmin: number,
            ymin: number,
            xmax: number,
            ymax: number,
            spatialReference: number,
        },
    },
};

const initialState = {
    options: {
        basemap: 'topo',
        container: 'mapView',
        zoom: 17,
        extentData: {
            xmin: -9177811,
            ymin: 4247000,
            xmax: -9176791,
            ymax: 4247784,
            spatialReference: 102100,
        },
    },
};

class EsriMap extends Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = { ...initialState };
    }

    render() {
        const { options } = this.state;
        const { activeNav } = this.props;

        return <EsriMapView options={options} activeNav={activeNav} />;
    }
}

export default EsriMap;
