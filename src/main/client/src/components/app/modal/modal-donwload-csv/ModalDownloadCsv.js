// @flow
import React from 'react';
import ModalContainer from '../../shared/Modal/ModalContainer';
import strings from '../../../../translations';
import { download, objectToCsv } from '../../../../utils/csvFile';

type Props = {
    layerFeatures: Object,
};

const ModalDownloadCsv = (props: Props) => {
    const {
        layerFeatures,
    } = props;

    const onlyVisibleColumns = () => {
        const columns = layerFeatures.columns.reduce((fd, d) => {
            if (d.show) {
                fd.push({ ...d });
            }
            return fd;
        }, []);

        return { columns };
    };

    const handleSelected = () => {
        const data = layerFeatures.data.reduce((fd, d) => {
            if (d._selected) {
                fd.push({ ...d });
            }
            return fd;
        }, []);

        const { columns } = onlyVisibleColumns();

        const csvData = objectToCsv(data, columns);
        download(csvData, layerFeatures.title);
    };

    const handleAll = () => {
        const { columns } = onlyVisibleColumns();

        const csvData = objectToCsv(layerFeatures.data, columns);
        download(csvData, layerFeatures.title);
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
        />

    );
};

export default ModalDownloadCsv;
