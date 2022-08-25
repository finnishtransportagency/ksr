import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ModalContainer from '../../shared/Modal/ModalContainer';
import { getCodedValue } from '../../../../utils/parseFeatureData';
import ModalSingleFeatureInfoView from './ModalSingleFeatureInfoView';
import strings from '../../../../translations';
import { toDisplayDate } from '../../../../utils/date';

const initialState = {
    featureData: [],
};

const ModalSingleFeatureInfo = () => {
    const [featureData, setFeatureData] = useState(initialState.featureData);

    const {
        layerId,
        attributeData,
        fromSource, // 'table' or 'map'
    } = useSelector(state => state.modal.activeModal.data);
    const { layerList } = useSelector(state => state.map.layerGroups);

    const parseFeature = (field, key) => {
        if (
            field
            && field.type !== 'esriFieldTypeOID'
            && !key.includes('LINK_OBJECTID')
            && !key.includes('CONTRACT_UUID')
        ) {
            return {
                label: field.label,
                value: field.type === 'esriFieldTypeDate'
                    ? toDisplayDate(attributeData[key])
                    : getCodedValue(field.domain, attributeData[key]),
            };
        }

        return null;
    };

    useEffect(() => {
        if (attributeData) {
            const layerFields = layerList.find(ll => ll.id === layerId).fields;

            if (fromSource === 'map') {
                setFeatureData(Object.keys(attributeData)
                    .map((key) => {
                        const field = layerFields.find(f => f.name === key);
                        return parseFeature(field, key);
                    })
                    .filter(data => data !== null));
            }

            if (fromSource === 'table') {
                setFeatureData(Object.keys(attributeData)
                    .filter(key => key.includes('/'))
                    .map((key) => {
                        const fieldName = key.split('/')[1];
                        const field = layerFields.find(f => f.name === fieldName);
                        return parseFeature(field, key);
                    })
                    .filter(data => data !== null));
            }
        }
    }, [attributeData, fromSource]);

    return (
        <ModalContainer
            modalSubmit={[]}
            title={strings.modalSingleFeatureInfo.title}
            cancelText={strings.modalSingleFeatureInfo.cancel}
        >
            <ModalSingleFeatureInfoView
                featureData={featureData}
            />
        </ModalContainer>
    );
};

export default ModalSingleFeatureInfo;
