// @flow
import React, { Fragment, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ModalContainer from '../../shared/Modal/ModalContainer';
import ModalContractDetailsView from './ModalContractDetailsView';
import { useCancelText, useDetailList, useFeatureAttributes, useTitle } from './customHooks';
import ModalSingleFeatureDetailsView from './modal-single-feature-details/ModalSingleFeatureDetailsView';
import { fetchContractDetails } from '../../../../api/contract/contractDetails';
import strings from '../../../../translations';
import { getSingleLayerFields } from '../../../../utils/map';

type Props = {
    layerId: string,
    contractObjectId: number,
    source: string,
    layerList: Object[],
    setActiveModal: (activeModal: string) => void,
    updateLayerFields: (layerId: number, fields: Object[]) => void,
};

const ModalContractDetails = (props: Props) => {
    let isMounted: boolean = true;

    const [activeView, setActiveView] = useState('contractDetails');
    const [activeFeature, setActiveFeature] = useState({
        layerName: null,
        layerId: null,
        featureId: null,
    });
    const [contractDetails, setContractDetails] = useState([]);
    const [fetchingDetailList, setFetchingDetailList] = useState(true);

    const cancelText = useCancelText(activeView, props.source, [activeView]);
    const title = useTitle(activeView, activeFeature, [activeView]);
    const detailList = useDetailList(contractDetails, props.layerList, [contractDetails]);
    const featureAttributes = useFeatureAttributes(
        contractDetails,
        props.layerList,
        activeView,
        activeFeature,
        [activeView],
    );

    /** Handle modal's 'cancel' -button. */
    function handleModalCancel() {
        props.setActiveModal('');
    }

    /** Handle modal's 'go back' -button depending on source, where the modal was opened from. */
    function handleGoBack() {
        if (activeView === 'contractDetails' && props.source === 'contractModal') {
            props.setActiveModal('featureContracts');
        } else if (activeView === 'contractDetails') {
            handleModalCancel();
        } else {
            setActiveView('contractDetails');
        }
    }

    /**
     * Handle single feature's detail click.
     *
     * @param {string} layerName Layer's name.
     * @param {string} layerId Layer's Id.
     * @param {number} featureId Feature's Id.
     */
    function handleFeatureDetailsClick(layerName: string, layerId: string, featureId: number) {
        setActiveView('singleFeatureDetails');
        setActiveFeature({ layerName, layerId, featureId });
    }

    /**
     * Gets data that will be used for generating contract details list.
     *
     * @param {string} layerId Layer's Id.
     * @param {number} contractObjectId Contract's object Id.
     *
     * @returns {Promise<void>} Returns after related features and fields found.
     */
    async function getContractDetails(layerId: string, contractObjectId: number) {
        setFetchingDetailList(true);

        const contractDetailsRes = await fetchContractDetails(
            parseInt(layerId, 10),
            contractObjectId,
        );

        if (contractDetailsRes && contractDetailsRes.length) {
            if (isMounted) {
                setContractDetails(contractDetailsRes.filter(layer => layer.id !== layerId));
            }

            await Promise.all(contractDetailsRes.map(async (layer) => {
                const originalLayer = props.layerList.find(l => l.id === layer.id);

                if (originalLayer && !originalLayer.fields) {
                    const { id, fields } = await getSingleLayerFields(originalLayer);
                    props.updateLayerFields(id, fields);
                }
            }));
        } else {
            toast.error(strings.modalContractDetails.errorNoFeaturesFound);
        }

        if (isMounted) setFetchingDetailList(false);
    }

    /** Get contract details list when component mounts */
    useEffect(() => {
        getContractDetails(props.layerId, props.contractObjectId);

        return () => { isMounted = false; };
    }, []);

    return (
        <ModalContainer
            modalSubmit={[]}
            title={title}
            handleModalCancel={handleModalCancel}
            cancelText={cancelText}
            handleGoBack={handleGoBack}
        >
            <Fragment>
                {activeView === 'contractDetails' && <ModalContractDetailsView
                    detailList={detailList}
                    handleFeatureDetailsClick={handleFeatureDetailsClick}
                    fetchingDetailList={fetchingDetailList}
                />}
                {activeView === 'singleFeatureDetails' && <ModalSingleFeatureDetailsView
                    featureAttributes={featureAttributes}
                />}
            </Fragment>
        </ModalContainer>
    );
};

export default ModalContractDetails;
