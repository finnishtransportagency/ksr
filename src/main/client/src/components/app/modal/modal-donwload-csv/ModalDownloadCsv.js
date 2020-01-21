// @flow
import React from 'react';
import ModalContainer from '../../shared/Modal/ModalContainer';
import strings from '../../../../translations';
import { download, objectToCsv } from '../../../../utils/csvFile';

type Props = {
    mergedLayerFeatures: Object,
};

const ModalDownloadCsv = (props: Props) => {
    const {
        mergedLayerFeatures,
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
        const data = mergedLayerFeatures.data.reduce((fd, d) => {
            if (d._selected && !d._filtered) {
                fd.push({ ...d });
            }
            return fd;
        }, []);

        const { columns } = onlyVisibleColumns();

        const csvData = objectToCsv(data, columns);
        download(csvData, mergedLayerFeatures.title);
    };

    const handleAll = () => {
        const data = mergedLayerFeatures.data.reduce((fd, d) => {
            if (!d._filtered) {
                fd.push({ ...d });
            }
            return fd;
        }, []);
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
