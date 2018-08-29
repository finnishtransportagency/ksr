// @flow
import { connect } from 'react-redux';
import { removeUserLayer } from '../../../../../../reducers/map/actions';
import { setActiveModal } from '../../../../../../reducers/modal/actions';
import MapLayerView from './MapLayerView';

const mapStateToProps = (state, ownProps) => ({
    layer: ownProps.layer,
    checked: ownProps.checked,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleLayerClick: () => {
        ownProps.handleLayerClick(ownProps.layer.id);
    },
    removeUserLayer: () => {
        dispatch(removeUserLayer(ownProps.layer.id));
        dispatch(setActiveModal('removeUserLayer'));
    },
});

const MapLayerContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MapLayerView);

export default MapLayerContainer;
