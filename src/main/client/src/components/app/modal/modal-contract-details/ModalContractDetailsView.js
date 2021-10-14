// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations';
import Contract from '../../../ui/blocks/Contract';
import LoadingIcon from '../../shared/LoadingIcon';
import { nestedVal } from '../../../../utils/nestedValue';

type Props = {
    contractLayer: Object,
    detailList: Object[],
    fetchingDetailList: boolean,
    activeAdmin: boolean,
    handleFeatureDetailsClick: (
        layerName: string,
        layerId: string,
        featureId: number,
        objectId: number,
    ) => void,
    handleFeatureLocateClick: (
        layerId: string,
        objectId: number,
    ) => Promise<void>,
    handleFeatureEditClick: (
        layerName: string,
        layerId: string,
        featureId: number,
        objectId: number,
    ) => void,
    handleFeatureUnlinkClick: (
        layerId: string,
        featureObjectId: number,
    ) => void,
};

const tiimeriTitle = strings.modalFeatureContracts.listView.tiimeriLink;
const caseManagementTitle = strings.modalFeatureContracts.listView.caseManagementLink;
const { showLocation } = strings.modalContractDetails.listView.showLocation;

const ModalContractDetailsView = ({
    contractLayer,
    detailList,
    fetchingDetailList,
    activeAdmin,
    handleFeatureDetailsClick,
    handleFeatureEditClick,
    handleFeatureUnlinkClick,
    handleFeatureLocateClick,
}: Props) => (
    <Fragment>
        {fetchingDetailList && <LoadingIcon loading={fetchingDetailList} />}
        {!fetchingDetailList && !detailList.length && (
            <p>{strings.modalContractDetails.errorNoFeaturesFound}</p>
        )
        }
        {!fetchingDetailList && detailList.map(layer => (
            <Fragment key={layer.name}>
                <p>{layer.name}</p>
                {!layer.features.length && <p>-</p>}
                {layer.features.map(feature => (
                    <Contract key={feature.objectId}>
                        <Contract.IconWrapper
                            wide={detailList.some(l => l.geometryData)}
                        >
                            <Fragment>
                                <Contract.IconWrapper.Icon
                                    title={strings.modalContractDetails.listView.details}
                                    className="fas fa-list-ul"
                                    onClick={() => handleFeatureDetailsClick(
                                        layer.name,
                                        layer.id,
                                        feature.id,
                                        feature.objectId,
                                    )}
                                />
                                {layer.geometryData && (
                                    <Contract.IconWrapper.Icon
                                        title={showLocation}
                                        className="fas fa-search-location"
                                        onClick={() => handleFeatureLocateClick(
                                            layer.id,
                                            feature.objectId,
                                        )}
                                    />
                                )}
                            </Fragment>
                        </Contract.IconWrapper>
                        <Contract.TextWrapper>
                            <Contract.TextWrapper.Text title={feature.id}>
                                {feature.id}
                            </Contract.TextWrapper.Text>
                            <Contract.TextWrapper.Text title={feature.description}>
                                {feature.description}
                            </Contract.TextWrapper.Text>
                        </Contract.TextWrapper>
                        <Contract.IconWrapper>
                            {activeAdmin && layer.editPermission && (
                                <Contract.IconWrapper.Icon
                                    onClick={() => handleFeatureEditClick(
                                        layer.name,
                                        layer.id,
                                        feature.id,
                                        feature.objectId,
                                    )}
                                    title={strings.modalContractDetails.listView.edit}
                                    className="fas fa-edit"
                                />
                            )}
                            {layer.id !== contractLayer.id
                            && activeAdmin
                            && layer.editPermission
                            && contractLayer.name.toLowerCase() !== 'tlaite sopimushallinta'
                            && nestedVal(
                                detailList.find(l => l.id === contractLayer.id),
                                ['editPermission'],
                            ) && (
                                <Contract.IconWrapper.Icon
                                    unlink
                                    onClick={() => {
                                        handleFeatureUnlinkClick(layer.id, feature.objectId);
                                    }}
                                    title={strings.modalContractDetails.listView.unlink}
                                    className="fas fa-unlink"
                                />
                            )}
                            {layer.id === contractLayer.id && (
                                <Fragment>
                                    <Contract.IconWrapper.Icon
                                        onClick={() => feature.tiimeriUrl
                                            && window.open(feature.tiimeriUrl, '_blank')}
                                        title={tiimeriTitle}
                                        className="fas fa-archive"
                                        disabled={!feature.tiimeriUrl}
                                    />
                                    <Contract.IconWrapper.Icon
                                        onClick={() => feature.caseManagementUrl
                                            && window.open(feature.caseManagementUrl, '_blank')}
                                        title={caseManagementTitle}
                                        className="fas fa-book"
                                        disabled={!feature.caseManagementUrl}
                                    />
                                </Fragment>
                            )}
                        </Contract.IconWrapper>
                    </Contract>
                ))}
            </Fragment>
        ))}
    </Fragment>
);

export default ModalContractDetailsView;
