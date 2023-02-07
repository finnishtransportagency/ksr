// @flow
import { connect } from 'react-redux';
import ModalDownloadCsv from './ModalDownloadCsv';
import { mergeColumnsByHeaderAndLabel } from '../../../../utils/parseFeatureData';
import { nestedVal } from '../../../../utils/nestedValue';

const mapStateToProps = (state: Object) => {
    const { activeTable, layers, filtered } = state.table.features;
    const { layerList } = state.map.layerGroups;

    const layerFeatures = activeTable && layers.length
        ? layers.find(l => l.id === activeTable)
        : null;

    const activeLayerFields = layerList.find(l => l.id === activeTable)
        && layerList.find(l => l.id === activeTable).fields;

    const mergedLayerFeatures = ({
        ...layerFeatures,
        columns: mergeColumnsByHeaderAndLabel(nestedVal(layerFeatures, ['columns'], {}), activeLayerFields),
    });

    return {
        mergedLayerFeatures,
        filtered,
    };
};

const ModalDownloadCsvContainer = (connect(mapStateToProps, null)(ModalDownloadCsv): any);

export default ModalDownloadCsvContainer;
