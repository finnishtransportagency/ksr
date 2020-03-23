// @flow
import React from 'react';
import ModalContainer from '../../shared/Modal/ModalContainer';
import strings from '../../../../translations';
import { download, objectToCsv } from '../../../../utils/csvFile';

type Props = {
    mergedLayerFeatures: Object,
    filtered: Object[],
};

const ModalDownloadCsv = (props: Props) => {
    const {
        mergedLayerFeatures,
        filtered,
    } = props;

    const onlyVisibleColumns = () => {
        const columns = mergedLayerFeatures.columns.reduce((fd, d) => {
            if (d.show) {
                fd.push({ ...d });
            }
            return fd;
        }, []);

        return { columns };
    };

    const handleSelected = () => {
        const data = mergedLayerFeatures.data
            .filter(a => a._selected && filtered
                .some(b => a._layerId === b.layerId && a._id === b.id));

        const { columns } = onlyVisibleColumns();

        const csvData = objectToCsv(data, columns);
        download(csvData, mergedLayerFeatures.title);
    };

    const handleAll = () => {
        const data = mergedLayerFeatures.data
            .filter(a => filtered.some(b => a._layerId === b.layerId && a._id === b.id));
        const { columns } = onlyVisibleColumns();

        const csvData = objectToCsv(data, columns);
        download(csvData, mergedLayerFeatures.title);
    };

    const modalSubmit = [
        {
            text: strings.modalDownloadCsv.all,
            handleSubmit: handleAll,
            disabled: false,
            toggleModal: true,
        },
        {
            text: strings.modalDownloadCsv.selected,
            handleSubmit: handleSelected,
            disabled: false,
            toggleModal: true,
        },
    ];

    return (
        <ModalContainer
            title={strings.modalDownloadCsv.title}
            modalSubmit={modalSubmit}
            cancelText={strings.modalDownloadCsv.cancel}
        >
            <p>{strings.modalDownloadCsv.description}</p>
        </ModalContainer>

    );
};

export default ModalDownloadCsv;
