// @flow
import React, { Fragment } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import 'react-select/dist/react-select.css';
import strings from '../../../../../translations';
import { TextInput, Button } from '../../../../ui/elements';
import Property from '../../../../ui/blocks/Property';
import LoadingIcon from '../../../shared/LoadingIcon';
import PropertyInfoView from './property-info/PropertyInfoView';
import PropertyPrintFilesView from './property-print-files/PropertyPrintFilesView';

type Props = {
    features: Object[],
    fetching: boolean,
    handlePropertyClick: (id: string) => void,
    handlePropertyZoomClick: (id: string) => void,
    activeProperty: string,
    handleProperyIdChange: Function,
    handleSubmit: Function,
    handleClear: Function,
    submitDisabled: boolean,
    propertyId: string,
};

const SearchPropertyView = ({
    features,
    fetching,
    handlePropertyClick,
    handlePropertyZoomClick,
    activeProperty,
    handleProperyIdChange,
    handleSubmit,
    handleClear,
    submitDisabled,
    propertyId,
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
                value={propertyId}
                placeholder=""
                name="propertyId"
                disabled={fetching}
                onChange={handleProperyIdChange}
            />
            <Button
                disabled={fetching || submitDisabled}
                type="submit"
                onClick={handleSubmit}
                onKeyPress={handleSubmit}
            >
                {strings.search.buttonSearch}
            </Button>
            <Button
                disabled={fetching || !features}
                onClick={handleClear}
                onKeyPress={handleClear}
            >
                {strings.search.buttonClear}
            </Button>
        </label>
        {fetching && <LoadingIcon loading={fetching} />}
        {features.length > 0 &&
            <Fragment>
                {features.map(property =>
                    (
                        <Property active={activeProperty === property.id} key={property.id}>
                            <Property.Header>
                                <Property.Header.Zoom
                                    className="search-suggestions-toggle"
                                    tabIndex="0"
                                    role="button"
                                    onClick={() => handlePropertyZoomClick(property.id)}
                                    onKeyPress={() => handlePropertyZoomClick(property.id)}
                                >
                                    <i className="fas fa-search-plus" />
                                </Property.Header.Zoom>
                                <Property.Header.Toggle
                                    className="search-suggestions-toggle"
                                    tabIndex="0"
                                    role="button"
                                    onClick={() => handlePropertyClick(property.id)}
                                    onKeyPress={() => handlePropertyClick(property.id)}
                                >
                                    <div>
                                        <span>{property.id}</span>
                                    </div>
                                    <div>
                                        <i
                                            className={
                                                activeProperty === property.id
                                                    ? 'fas fa-chevron-up'
                                                    : 'fas fa-chevron-down'
                                            }
                                        />
                                    </div>
                                </Property.Header.Toggle>
                            </Property.Header>
                            <Property.Content hidden={activeProperty !== property.id}>
                                <PropertyInfoView properties={property.properties} />
                                <br />
                                <PropertyPrintFilesView
                                    links={property.links}
                                    fetching={property.fetchingLinks}
                                />
                            </Property.Content>
                        </Property>
                    ))}
            </Fragment>
        }
    </Scrollbars>
);

export default SearchPropertyView;
