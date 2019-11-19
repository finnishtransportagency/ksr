// @flow
import { connect } from 'react-redux';
import ModalDownloadCsv from './ModalDownloadCsv';

const mapStateToProps = (state) => {
    const { activeTable, layers } = state.table.features;

    const layerFeatures = activeTable && layers.length
        ? layers.find(l => l.id === activeTable)
        : null;

    return {
        layerFeatures,
    };
};

const ModalDownloadCsvContainer = connect(mapStateToProps, null)(ModalDownloadCsv);

export default ModalDownloadCsvContainer;
