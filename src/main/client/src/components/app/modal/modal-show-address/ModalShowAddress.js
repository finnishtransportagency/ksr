// @flow
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ModalContainer from '../../shared/Modal/ModalContainer';
import { createAddressFields } from '../../../../utils/geoconvert/createAddressFields';
import LoadingIcon from '../../shared/LoadingIcon';
import strings from '../../../../translations';

type Props = {
    data: Object
};

type State = {
    address: ?string,
    modalSubmit: Object[],
    fetchingAddress: boolean,
}

const initialState: State = {
    address: '',
    modalSubmit: [],
    fetchingAddress: true,
};

class ModalShowAddress extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };
    }

    async componentDidMount() {
        const { data } = this.props;
        const { featureType } = data;
        const addressField = 'address';
        const feature = await createAddressFields(
            data,
            featureType,
            addressField,
        );
        if (feature) {
            if (feature.attributes.address === '') {
                this.setState({
                    fetchingAddress: false,
                    address: strings.modalShowAddress.noAddressFound,
                });
            } else {
                this.setState({
                    fetchingAddress: false,
                    address: feature.attributes.address,
                });
            }
        } else {
            toast.error(strings.modalShowAddress.noAddressFound);
            this.setState({
                fetchingAddress: false,
                address: strings.modalShowAddress.noAddressFound,
            });
        }
    }

    render() {
        const { address, modalSubmit, fetchingAddress } = this.state;

        return (
            <ModalContainer
                title={strings.modalShowAddress.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalShowAddress.backText}
            >
                {fetchingAddress
                    ? <LoadingIcon loading={fetchingAddress} />
                    : <p>{address}</p> }
            </ModalContainer>
        );
    }
}

export default ModalShowAddress;
