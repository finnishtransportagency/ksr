// @flow
import moment from 'moment';
import React, { Fragment } from 'react';
import strings from '../../../../../../translations';
import { PropertyFeature } from '../styles';

type Props = {
    properties: Object,
};

const PropertyInfoView = ({ properties }: Props) => (
    <Fragment>
        <PropertyFeature>
            <span>{strings.searchProperty.municipality}</span>
            <span>{properties.municipalityName}</span>
        </PropertyFeature>
        <PropertyFeature>
            <span>{strings.searchProperty.parcelCount}</span>
            <span>{properties.parcelCount}</span>
        </PropertyFeature>
        <PropertyFeature>
            <span>{strings.searchProperty.registerUnitType}</span>
            <span>{properties.registerUnitType}</span>
        </PropertyFeature>
        <PropertyFeature>
            <span>{strings.searchProperty.name}</span>
            <span title={properties.name}>{properties.name}</span>
        </PropertyFeature>
        <PropertyFeature>
            <span>{strings.searchProperty.landArea}</span>
            <span>{properties.landArea
                ? properties.landArea.toFixed(2)
                : ''}
            {properties.landArea > 0 && ' ha'}
            </span>
        </PropertyFeature>
        <PropertyFeature>
            <span>{strings.searchProperty.registrationDate}</span>
            <span>{properties.registrationDate
                ? moment(properties.registrationDate, 'YYYYMMDD').format('DD.MM.YYYY')
                : ''}
            </span>
        </PropertyFeature>
    </Fragment>
);

export default PropertyInfoView;
