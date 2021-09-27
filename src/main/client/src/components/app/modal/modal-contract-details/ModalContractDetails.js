// @flow
import React, { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
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
import { getSingleLayerFields, zoomToFeatures } from '../../../../utils/map';
import { unlinkFeatureFromContract } from '../../../../utils/contracts/contracts';
import { nestedVal } from '../../../../utils/nestedValue';
import { queryFeatures } from '../../../../api/search/searchQuery';
import { fetchContractRelation } from '../../../../api/contract/contractRelations';

type Props = {
    contractLayer: Object,
    contractObjectId: number,
    source: string,
    layerList: Object[],
    setActiveModal: (activeModal: string) => void,
    updateLayerFields: (layerId: number, fields: Object[]) => void,
    activeAdmin: string,
    showConfirmModal: (
        body: string,
        acceptText: string,
        cancelText: string,
        accept: Function
    ) => void,
    tableFeaturesLayers: Object[],
    view: Object,
    updateRelatedLayersData: (layers: Object[]) => void;
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
        showConfirmModal,
        tableFeaturesLayers,
        view,
        updateRelatedLayersData,
    } = props;

    const [activeView, setActiveView] = useState('contractDetails');
    const [activeFeature, setActiveFeature] = useState({
        layerName: null,
        layerId: null,
        featureId: null,
        objectId: null,
    });
    const [contractDetails, setContractDetails] = useState([]);
    const [detailLayers, setDetailLayers] = useState([]);
    const [fetchingDetailList, setFetchingDetailList] = useState(true);
    const [activeDetailLayer, setActiveDetailLayer] = useState(null);
    const [refreshList, setRefreshList] = useState(false);
    const [formOptions, setFormOptions] = useState({ editedFields: {}, submitDisabled: true });
    const [existingAttributes, setExistingAttributes] = useState(null);

    const detailList = useDetailList(contractDetails, layerList, [contractDetails]);
    const modalSubmit = useModalSubmit(
        contractDetails,
        activeView,
        contractLayer,
        contractObjectId,
        detailLayers,
        setActiveView,
        activeDetailLayer,
        setRefreshList,
        formOptions,
        setFormOptions,
        activeAdmin,
        detailList,
        activeFeature,
        [contractDetails, activeView, detailLayers, formOptions],
    );
    const cancelText = useCancelText(activeView, source, [activeView]);
    const title = useTitle(activeView, activeFeature, [activeView]);
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
     * @param {number} objectId Feature's object Id.
     */
    const handleFeatureDetailsClick = (
        layerName: string,
        layerId: string,
        featureId: number,
        objectId: number,
    ) => {
        setActiveView('singleFeatureDetails');
        setActiveFeature({
            layerName, layerId, featureId, objectId,
        });
    };

    /**
     * Handle single feature's locate click.
     *
     * @param {string} layerId Layer's Id.
     * @param {number} objectId Feature's object Id.
     */
    const handleFeatureLocateClick = async (layerId: string, objectId: number) => {
        const layer = layerList.find(l => l.id === layerId);
        if (layer) {
            const objectIdFieldName = nestedVal(
                layer.fields.find(field => field.type === 'esriFieldTypeOID'),
                ['name'],
            );
            const foundObject = await queryFeatures(
                parseInt(layerId, 10),
                `${objectIdFieldName} = '${objectId}'`,
                null,
            );
            if (Array.isArray(foundObject.features) && foundObject.features.length > 0) {
                await zoomToFeatures(view, foundObject.features);
            }
        }
        handleModalCancel();
    };

    /**
    /**
     * Handle single feature's edit click.
     *
     * @param {string} layerName Layer's name.
     * @param {string} layerId Layer's Id.
     * @param {number} featureId Feature's Id.
     * @param {number} objectId Feature's object Id.
     */
    const handleFeatureEditClick = (
        layerName: string,
        layerId: string,
        featureId: number,
        objectId: number,
    ) => {
        setActiveView('editFeature');
        setActiveFeature({
            layerName, layerId, featureId, objectId,
        });
        setActiveDetailLayer(layerList.find(layer => layer.id === layerId));
    };

    /**
     * Handles single feature's unlinking from contract.
     *
     * @param {string} layerId Detail layer's Id.
     * @param {number} featureObjectId Feature's object Id.
     */
    const handleFeatureUnlinkClick = (layerId: string, featureObjectId: number) => {
        const {
            content, submit, cancel, featureUnlinkSuccess, featureUnlinkError,
        } = strings.modalContractDetails.confirmModalUnlinkContract;

        showConfirmModal(
            content,
            submit,
            cancel,
            async () => {
                setFetchingDetailList(true);
                const detailLayer = layerList.find(layer => layer.id === layerId);
                const unlinkSuccess = await unlinkFeatureFromContract(
                    contractLayer,
                    detailLayer,
                    contractObjectId,
                    featureObjectId,
                );
                updateRelatedLayersData([detailLayer, contractLayer]);

                if (unlinkSuccess) {
                    toast.success(featureUnlinkSuccess);
                } else {
                    toast.error(featureUnlinkError);
                }

                setRefreshList(true);
            },
        );
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

        let contractDetailsRes = await fetchContractDetails(
            parseInt(contractLayer.id, 10),
            contractObjectId,
        );

        // Custom logic for Tlaite Sopimushallinta to get connected sopimukset and yhteystiedot.
        if (contractLayer.name.toLowerCase() === 'tlaite sopimushallinta') {
            try {
                const turvalaiteId = layerList.find(ll => ll.name.toLowerCase() === 'turvalaite').id;
                const turvalaiteSopimusId = layerList.find(ll => ll.name.toLowerCase() === 'tlaite sopimus').id;
                const turvalaiteNumero = contractDetailsRes
                    .find(a => a.id === turvalaiteId).features[0].attributes.TLNUMERO;

                const contractDetailsResTurvalaite = await fetchContractRelation(
                    turvalaiteId,
                    turvalaiteNumero,
                );

                const turvalaiteFeatures = contractDetailsResTurvalaite
                    .find(res => res.layerId === turvalaiteSopimusId).features;

                if (turvalaiteFeatures !== null) {
                    const sopimusObjectIdt = turvalaiteFeatures
                        .map(res => res.attributes.OBJECTID);

                    const tlaiteSopimusResponses = await Promise.all(
                        sopimusObjectIdt.map(async objectId => fetchContractDetails(
                            turvalaiteSopimusId,
                            objectId,
                        )),
                    );

                    const flatResponse = tlaiteSopimusResponses
                        .flatMap(tlaiteRes => tlaiteRes)
                        .filter(tlaiteRes => !contractDetailsRes
                            .map(res => res.id)
                            .includes(tlaiteRes.id));
                    const ids = flatResponse.map(flatRes => flatRes.id);
                    const filtered = flatResponse
                        .filter(({ id }, index) => !ids.includes(id, index + 1))
                        .map(flatRes => ({
                            ...flatRes,
                            features: flatResponse
                                .filter(res => res.id === flatRes.id)
                                .map(res => res.features)
                                .flatMap(res => res),
                        }));

                    contractDetailsRes = contractDetailsRes.concat(filtered);
                }
            } catch (error) {
                toast.error(strings.modalContractDetails.errorSopimushallintaAttributes);
            }
        }

        if (contractDetailsRes && contractDetailsRes.length) {
            await Promise.all(contractDetailsRes.map(async (layer) => {
                const originalLayer = layerList.find(l => l.id === layer.id);

                if (originalLayer && !originalLayer.fields) {
                    const { id, fields } = await getSingleLayerFields(originalLayer);
                    updateLayerFields(id, fields);
                }
            }));

            if (isMounted) {
                setContractDetails(contractDetailsRes);
                setDetailLayers(contractDetailsRes
                    .filter(layer => layer.id !== contractLayer.id && layer.type === 'agfl'));
            }
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

    /** Refresh the list if some detail was edited */
    useEffect(() => {
        if (refreshList) {
            getContractDetails();
            setRefreshList(false);
        }
    }, [refreshList]);

    /** Set the existing attributes for feature to be used in edit form */
    useEffect(() => {
        if (activeView === 'editFeature' && featureAttributes.length) {
            setExistingAttributes(featureAttributes.reduce((acc, cur) => {
                acc[cur.name] = cur.value;
                return acc;
            }, {}));
        } else {
            setExistingAttributes(null);
        }
    }, [featureAttributes]);

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
                        contractLayer={contractLayer}
                        detailList={detailList}
                        fetchingDetailList={fetchingDetailList}
                        activeAdmin={detailList.some(layer => layer.id === activeAdmin)}
                        handleFeatureDetailsClick={handleFeatureDetailsClick}
                        handleFeatureEditClick={handleFeatureEditClick}
                        handleFeatureUnlinkClick={handleFeatureUnlinkClick}
                        tableFeaturesLayers={tableFeaturesLayers}
                        handleFeatureLocateClick={handleFeatureLocateClick}
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
                        detailList={detailList}
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
                {activeView === 'editFeature' && existingAttributes && (
                    <FeatureDetailsForm
                        layer={activeDetailLayer}
                        setFormOptions={setFormOptions}
                        formType="edit"
                        existingAttributes={existingAttributes}
                    />
                )}
            </Fragment>
        </ModalContainer>
    );
};

export default ModalContractDetails;
