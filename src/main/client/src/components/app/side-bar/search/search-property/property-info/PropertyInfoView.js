// @flow
import moment from 'moment';
import React, { Fragment } from 'react';
import strings from '../../../../../../translations';
import { H2 } from '../../../../../ui/elements';
import { PropertyFeature } from '../styles';

type Props = {
    properties: Object,
};

const PropertyInfoView = ({ properties }: Props) => (
    <Fragment>
        <H2>{strings.searchProperty.propertyInfo}</H2>
        <PropertyFeature>
            <span>{strings.searchProperty.propertyIdentifier}</span>
            <span>{properties.propertyIdentifier}</span>
        </PropertyFeature>
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
            <span>{properties.name}</span>
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
            <span>{properties.registerationDate
                ? moment(properties.registrationDate, 'YYYYMMDD').format('DD.MM.YYYY')
                : ''}
            </span>
        </PropertyFeature>
    </Fragment>
);

export default PropertyInfoView;
