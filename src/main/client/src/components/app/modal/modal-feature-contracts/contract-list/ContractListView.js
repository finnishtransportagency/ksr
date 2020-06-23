// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../translations';
import Contract from '../../../../ui/blocks/Contract';

type Props = {
    contracts: Object[],
    handleUnlinkContract: (contractNumber: string, layerId: string) => any,
    setActiveView: Function,
    editLayerPermission: boolean,
    handleContractDetailsClick: (contractNumber: number, layerId: string) => Promise<any>,
};

const ContractListView = ({
    contracts,
    handleUnlinkContract,
    setActiveView,
    editLayerPermission,
    handleContractDetailsClick,
}: Props) => (
    <Fragment>
        {!contracts.length && <p>{strings.modalFeatureContracts.listView.noContracts}</p>}
        {contracts.map(c => (
            <Fragment key={c.name}>
                <p>{c.name}</p>
                {c.contract.map(contract => (
                    <Contract key={contract.id}>
                        <Contract.IconWrapper>
                            <Contract.IconWrapper.Icon
                                title={strings.modalFeatureContracts.listView.features}
                                className="fas fa-external-link-square-alt"
                                onClick={() => handleContractDetailsClick(
                                    contract.id,
                                    contract.layerId,
                                )}
                            />
                        </Contract.IconWrapper>
                        <Contract.TextWrapper>
                            <Contract.TextWrapper.Text title={contract.id}>
                                {contract.id}
                            </Contract.TextWrapper.Text>
                            <Contract.TextWrapper.Text title={contract.description}>
                                {contract.description}
                            </Contract.TextWrapper.Text>
                        </Contract.TextWrapper>
                        <Contract.IconWrapper>
                            {editLayerPermission
                        && (
                            <Contract.IconWrapper.Icon
                                edit
                                onClick={() => setActiveView('editContract', contract.id, contract.layerId)
                                }
                                title={strings.modalFeatureContracts.listView.edit}
                                className="fas fa-edit"
                            />
                        )
                            }
                            <Contract.IconWrapper.Icon
                                onClick={() => contract.alfrescoUrl && window.open(contract.alfrescoUrl, '_blank')}
                                title={strings.modalFeatureContracts.listView.alfrescoLink}
                                className="fas fa-archive"
                                disabled={!contract.alfrescoUrl}
                            />
                            <Contract.IconWrapper.Icon
                                onClick={() => contract.caseManagementUrl && window.open(contract.caseManagementUrl, '_blank')}
                                title={strings.modalFeatureContracts.listView.caseManagementLink}
                                className="fas fa-book"
                                disabled={!contract.caseManagementUrl}
                            />
                            {contract.contractUnlinkable && editLayerPermission
                        && (
                            <Contract.IconWrapper.Icon
                                unlink
                                onClick={() => handleUnlinkContract(contract.id, contract.layerId)}
                                title={strings.modalFeatureContracts.listView.unlink}
                                className="fas fa-unlink"
                            />
                        )
                            }
                        </Contract.IconWrapper>
                    </Contract>
                ))}
            </Fragment>
        ))}
    </Fragment>
);

export default ContractListView;
