// @flow
import { connect } from 'react-redux';
import { showConfirmModal } from '../../../../../../reducers/confirmModal/actions';
import { removeUserLayer, removeUserLayerConfirmed } from '../../../../../../reducers/map/actions';
import MapLayerView from './MapLayerView';

const mapStateToProps = (state, ownProps) => ({
    layer: ownProps.layer,
    checked: ownProps.checked,
    layerList: state.map.layerGroups.layerList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    handleLayerClick: () => {
        ownProps.handleLayerClick(ownProps.layer.id);
    },
    removeUserLayer: (layerList: Object[]) => {
        dispatch(removeUserLayer(ownProps.layer.id));
        dispatch(removeUserLayerConfirmed(ownProps.layer.id, layerList));
    },
    showConfirmModal: (body: string, acceptText: string, cancelText: string, accept: Function) => {
        dispatch(showConfirmModal(body, acceptText, cancelText, accept));
    },
});

const MapLayerContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(MapLayerView);

export default MapLayerContainer;
