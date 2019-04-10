// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations';
import Contract from '../../../ui/blocks/Contract';
import LoadingIcon from '../../shared/LoadingIcon';

type Props = {
    contractLayerId: string,
    detailList: Object[],
    fetchingDetailList: boolean,
    editPermission: boolean,
    handleFeatureDetailsClick: (
        layerName: string,
        layerId: string,
        featureId: number,
        objectId: number
    ) => void,
    handleFeatureEditClick: (
        layerName: string,
        layerId: string,
        featureId: number,
        objectId: number
    ) => void,
    handleFeatureUnlinkClick: (layerId: string, featureObjectId: number) => void,
};

const alfrescoTitle = strings.modalFeatureContracts.listView.alfrescoLink;
const caseManagementTitle = strings.modalFeatureContracts.listView.caseManagementLink;

const ModalContractDetailsView = ({
    contractLayerId,
    detailList,
    fetchingDetailList,
    editPermission,
    handleFeatureDetailsClick,
    handleFeatureEditClick,
    handleFeatureUnlinkClick,
}: Props) => (
    <Fragment>
        {fetchingDetailList && <LoadingIcon loading={fetchingDetailList} />}
        {!fetchingDetailList && !detailList.length && (
            <p>{strings.modalContractDetails.errorNoFeaturesFound}</p>
        )
        }
        { !fetchingDetailList && detailList.map(layer => (
            <Fragment key={layer.name}>
                <p>{layer.name}</p>
                {!layer.features.length && <p>-</p>}
                {layer.features.map(feature => (
                    <Contract key={feature.id}>
                        <Contract.IconWrapper>
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
                            { editPermission && (
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
                            { layer.id !== contractLayerId && editPermission && (
                                <Contract.IconWrapper.Icon
                                    unlink
                                    onClick={() => {
                                        handleFeatureUnlinkClick(layer.id, feature.objectId);
                                    }}
                                    title={strings.modalContractDetails.listView.unlink}
                                    className="fas fa-unlink"
                                />
                            )}
                            { layer.id === contractLayerId && (
                                <Fragment>
                                    <Contract.IconWrapper.Icon
                                        onClick={() => feature.alfrescoUrl
                                            && window.open(feature.alfrescoUrl, '_blank')}
                                        title={alfrescoTitle}
                                        className="fas fa-archive"
                                        disabled={!feature.alfrescoUrl}
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
