// @flow
import { connect } from 'react-redux';
import { setMapTools, setSnappingFeatureSources } from '../../../../reducers/map/actions';
import MapTools from './MapTools';

const mapStateToProps = state => ({
    viewLayersCount: state.map.mapView.view ? state.map.mapView.view.allLayerViews.length : 0,
    view: state.map.mapView.view,
    tempGraphicsLayer: state.map.mapView.graphicsLayer,
});

const mapDispatchToProps = dispatch => ({
    setMapTools: (draw, sketchViewModel) => {
        dispatch(setMapTools(draw, sketchViewModel));
    },
    setSnappingFeatureSources: (sketchViewModel) => {
        dispatch(setSnappingFeatureSources(sketchViewModel));
    },
});

const MapToolsContainer = (connect(mapStateToProps, mapDispatchToProps)(MapTools): any);

export default MapToolsContainer;
