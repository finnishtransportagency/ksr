// @flow
import React, { Fragment } from 'react';
import strings from '../../../../../translations';
import Contract from '../../../../ui/blocks/Contract';

type Props = {
    contracts: Object[],
    contractUnlinkable: boolean,
    handleUnlinkContract: (contractNumber: number) => any,
};

const ContractListView = ({
    contracts, contractUnlinkable, handleUnlinkContract,
}: Props) => (
    <Fragment>
        { !contracts.length && <p>{strings.modalFeatureContracts.listView.noContracts}</p> }
        { contracts.map(contract =>
            (
                <Contract key={contract.id}>
                    <Contract.IconWrapper>
                        <Contract.IconWrapper.Icon
                            title={strings.modalFeatureContracts.listView.details}
                            className="fas fa-th-list"
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
                        <Contract.IconWrapper.Icon
                            edit
                            title={strings.modalFeatureContracts.listView.edit}
                            className="fas fa-edit"
                        />
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
                        {contractUnlinkable &&
                        <Contract.IconWrapper.Icon
                            unlink
                            onClick={() => { handleUnlinkContract(contract.id); }}
                            title={strings.modalFeatureContracts.listView.unlink}
                            className="fas fa-unlink"
                        />
                        }
                    </Contract.IconWrapper>
                </Contract>
            ))}
    </Fragment>
);

export default ContractListView;
