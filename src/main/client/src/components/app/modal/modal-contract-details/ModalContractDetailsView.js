// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations';
import Contract from '../../../ui/blocks/Contract';
import LoadingIcon from '../../shared/LoadingIcon';

type Props = {
    detailList: Object[],
    handleFeatureDetailsClick: (layerName: string, layerId: string, featureId: number) => void,
    fetchingDetailList: boolean,
};

const ModalContractDetailsView = ({
    detailList,
    handleFeatureDetailsClick,
    fetchingDetailList,
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
                    </Contract>
                ))}
            </Fragment>
        ))}
    </Fragment>
);

export default ModalContractDetailsView;
