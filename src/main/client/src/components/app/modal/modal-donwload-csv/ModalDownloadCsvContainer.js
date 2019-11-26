// @flow
import { connect } from 'react-redux';
import ModalDownloadCsv from './ModalDownloadCsv';
import { mergeColumnsByHeaderAndLabel } from '../../../../utils/parseFeatureData';

const mapStateToProps = (state) => {
    const { activeTable, layers } = state.table.features;
    const { layerList } = state.map.layerGroups;

    const layerFeatures = activeTable && layers.length
        ? layers.find(l => l.id === activeTable)
        : null;

    const activeLayerFields = layerList.find(l => l.id === activeTable)
        && layerList.find(l => l.id === activeTable).fields;

    const mergedLayerFeatures = ({
        ...layerFeatures,
        columns: mergeColumnsByHeaderAndLabel(layerFeatures.columns, activeLayerFields),
    });

    return {
        mergedLayerFeatures,
    };
};

const ModalDownloadCsvContainer = connect(mapStateToProps, null)(ModalDownloadCsv);

export default ModalDownloadCsvContainer;
