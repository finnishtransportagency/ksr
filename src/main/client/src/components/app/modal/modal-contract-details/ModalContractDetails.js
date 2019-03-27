// @flow
import React, { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { nestedVal } from '../../../../utils/nestedValue';
import FeatureDetailsForm from '../../shared/feature-details-form/FeatureDetailsForm';
import ModalContainer from '../../shared/Modal/ModalContainer';
import DetailLayerSelect from './detail-layer-select/DetailLayerSelect';
import ModalContractDetailsView from './ModalContractDetailsView';
import {
    useCancelText, useDetailList, useFeatureAttributes, useModalSubmit, useTitle,
} from './customHooks';
import ModalSingleFeatureDetailsView from './modal-single-feature-details/ModalSingleFeatureDetailsView';
import { fetchContractDetails } from '../../../../api/contract/contractDetails';
import strings from '../../../../translations';
import { getSingleLayerFields } from '../../../../utils/map';

type Props = {
    contractLayer: Object,
    contractObjectId: number,
    source: string,
    layerList: Object[],
    setActiveModal: (activeModal: string) => void,
    updateLayerFields: (layerId: number, fields: Object[]) => void,
    activeAdmin: string,
};

const ModalContractDetails = (props: Props) => {
    let isMounted: boolean = true;

    const {
        source,
        layerList,
        contractLayer,
        contractObjectId,
        updateLayerFields,
        setActiveModal,
        activeAdmin,
    } = props;

    const [activeView, setActiveView] = useState('contractDetails');
    const [activeFeature, setActiveFeature] = useState({
        layerName: null,
        layerId: null,
        featureId: null,
    });
    const [contractDetails, setContractDetails] = useState([]);
    const [detailLayers, setDetailLayers] = useState([]);
    const [fetchingDetailList, setFetchingDetailList] = useState(true);
    const [activeDetailLayer, setActiveDetailLayer] = useState(null);
    const [detailAdded, setDetailAdded] = useState(false);
    const [formOptions, setFormOptions] = useState({ editedFields: {}, submitDisabled: true });
    const [permission, setPermission] = useState({ create: false, edit: false });

    const modalSubmit = useModalSubmit(
        contractDetails,
        activeView,
        contractLayer,
        contractObjectId,
        detailLayers,
        setActiveView,
        activeDetailLayer,
        setDetailAdded,
        formOptions,
        setFormOptions,
        permission,
        [contractDetails, activeView, detailLayers, formOptions],
    );
    const cancelText = useCancelText(activeView, source, [activeView]);
    const title = useTitle(activeView, activeFeature, [activeView]);
    const detailList = useDetailList(contractDetails, layerList, [contractDetails]);
    const featureAttributes = useFeatureAttributes(
        contractDetails,
        layerList,
        activeView,
        activeFeature,
        [activeView],
    );

    /** Handle modal's 'cancel' -button. */
    const handleModalCancel = () => {
        setActiveModal('');
    };

    /** Handle modal's 'go back' -button depending on source, where the modal was opened from. */
    const handleGoBack = () => {
        if (activeView === 'contractDetails' && source === 'contractModal') {
            setActiveModal('featureContracts');
        } else if (activeView === 'contractDetails') {
            handleModalCancel();
        } else {
            setActiveView('contractDetails');
        }
    };

    /**
     * Handle single feature's detail click.
     *
     * @param {string} layerName Layer's name.
     * @param {string} layerId Layer's Id.
     * @param {number} featureId Feature's Id.
     */
    const handleFeatureDetailsClick = (layerName: string, layerId: string, featureId: number) => {
        setActiveView('singleFeatureDetails');
        setActiveFeature({ layerName, layerId, featureId });
    };

    /**
     * Gets data that will be used for generating contract details list. Also saves detail layers
     * to state after contract details and fields found for the layers and checks whether user
     * has permission for contract layer and admin state is active for any of the layers.
     *
     * @returns {Promise<void>} Returns after related features and fields found.
     */
    const getContractDetails = async () => {
        setFetchingDetailList(true);

        const contractDetailsRes = await fetchContractDetails(
            parseInt(contractLayer.id, 10),
            contractObjectId,
        );

        if (contractDetailsRes && contractDetailsRes.length) {
            if (isMounted) {
                setContractDetails(contractDetailsRes);

                const createPermission = contractDetailsRes
                    .some(layer => layer.id === activeAdmin)
                    && nestedVal(contractLayer, ['layerPermission', 'createLayer'], false);

                const editPermission = contractDetailsRes
                    .some(layer => layer.id === activeAdmin)
                && nestedVal(contractLayer, ['layerPermission', 'updateLayer'], false);

                setPermission({ create: createPermission, edit: editPermission });
            }

            await Promise.all(contractDetailsRes.map(async (layer) => {
                const originalLayer = layerList.find(l => l.id === layer.id);


                if (originalLayer && !originalLayer.fields) {
                    const { id, fields } = await getSingleLayerFields(originalLayer);
                    updateLayerFields(id, fields);
                }
            }));
            if (isMounted) setDetailLayers(contractDetailsRes.filter(layer => layer.id !== contractLayer.id && layer.type === 'agfl'));
        } else {
            toast.error(strings.modalContractDetails.errorNoFeaturesFound);
        }

        if (isMounted) setFetchingDetailList(false);
    };

    /** Get contract details list when component mounts */
    useEffect(() => {
        getContractDetails();

        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        if (detailAdded) {
            getContractDetails();
            setDetailAdded(false);
        }
    }, [detailAdded]);

    return (
        <ModalContainer
            modalSubmit={modalSubmit}
            title={title}
            handleModalCancel={handleModalCancel}
            cancelText={cancelText}
            handleGoBack={handleGoBack}
        >
            <Fragment>
                {activeView === 'contractDetails' && (
                    <ModalContractDetailsView
                        detailList={detailList}
                        handleFeatureDetailsClick={handleFeatureDetailsClick}
                        fetchingDetailList={fetchingDetailList}
                    />
                )}
                {activeView === 'singleFeatureDetails' && (
                    <ModalSingleFeatureDetailsView
                        featureAttributes={featureAttributes}
                    />
                )}
                {activeView === 'chooseDetailLayer' && (
                    <DetailLayerSelect
                        detailLayers={detailLayers}
                        setActiveView={setActiveView}
                        setActiveDetailLayer={setActiveDetailLayer}
                        layerList={layerList}
                    />
                )}
                {activeView === 'addNewDetail' && (
                    <FeatureDetailsForm
                        layer={activeDetailLayer}
                        setFormOptions={setFormOptions}
                        formType="add"
                    />
                )}
            </Fragment>
        </ModalContainer>
    );
};

export default ModalContractDetails;
