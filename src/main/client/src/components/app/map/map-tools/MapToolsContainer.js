// @flow
import { connect } from 'react-redux';
import { setMapTools } from '../../../../reducers/map/actions';
import MapTools from './MapTools';

const mapStateToProps = state => ({
    view: state.map.mapView,
});

const mapDispatchToProps = dispatch => ({
    setMapTools: (draw, sketchViewModel) => {
        dispatch(setMapTools(draw, sketchViewModel));
    },
});

const MapToolsContainer = connect(mapStateToProps, mapDispatchToProps)(MapTools);

export default MapToolsContainer;
