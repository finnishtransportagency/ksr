// @flow
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-select/dist/react-select.css';
import strings from '../../../../../translations';
import { TextInput } from '../../../../ui/elements';
import LoadingIcon from '../../../shared/LoadingIcon';
import PropertyInfoView from './property-info/PropertyInfoView';
import PropertyPrintFilesView from './property-print-files/PropertyPrintFilesView';

type Props = {
    propertyId: string,
    properties: Object,
    links: Object,
    fetching: boolean,
    fetchingLinks: boolean,
};

const SearchPropertyView = ({
    propertyId,
    properties,
    links,
    fetching,
    fetchingLinks,
}: Props) => (
    <Scrollbars
        autoHide
        className="sidebar-content-scroll-wrapper"
        renderView={scrollProps =>
            <div {...scrollProps} className="sidebar-content-scroll-inner" />}
        renderThumbVertical={scrollProps =>
            <div {...scrollProps} className="sidebar-content-scroll-thumb" />}
    >
        <label
            htmlFor="propertyId"
        >
            <p>{strings.searchProperty.propertyIdentifier}</p>
            <TextInput
                type="text"
                value={propertyId || ''}
                placeholder=""
                name="propertyId"
                disabled
            />
        </label>
        {fetching && <LoadingIcon loading={fetching} />}
        {properties && <PropertyInfoView properties={properties} />}
        <br />
        {properties && <PropertyPrintFilesView links={links} fetching={fetchingLinks} />}
    </Scrollbars>
);

export default SearchPropertyView;
