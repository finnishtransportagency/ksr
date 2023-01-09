import { formatPropertyInfoToSaveFormat, propertyIdFormat, validatePropertyId } from '../property';

describe.skip('property.js', () => {
    it('should return correct validation for property id', () => {
        expect(validatePropertyId(null)).toBeFalsy();
        expect(validatePropertyId(undefined)).toBeFalsy();
        expect(validatePropertyId({})).toBeFalsy();
        expect(validatePropertyId(1)).toBeFalsy();
        expect(validatePropertyId([])).toBeFalsy();
        expect(validatePropertyId(() => {
        })).toBeFalsy();
        expect(validatePropertyId('a')).toBeFalsy();
        expect(validatePropertyId('1-2-3-4-')).toBeFalsy();
        expect(validatePropertyId('0010020003004')).toBeFalsy();
        expect(validatePropertyId('001002000300400')).toBeFalsy();

        expect(validatePropertyId('1-2-3-4')).toBeTruthy();
        expect(validatePropertyId('00100200030004')).toBeTruthy();
    });

    it('should return correct format for property id', () => {
        expect(propertyIdFormat(null)).toBe('');
        expect(propertyIdFormat(undefined)).toBe('');
        expect(propertyIdFormat({})).toBe('');
        expect(propertyIdFormat(1)).toBe('');
        expect(propertyIdFormat([])).toBe('');
        expect(propertyIdFormat(() => {
        })).toBe('');
        expect(propertyIdFormat('a')).toBe('');
        expect(propertyIdFormat('1-2-3-4-')).toBe('');
        expect(propertyIdFormat('0010020003004')).toBe('');
        expect(propertyIdFormat('001002000300400')).toBe('');

        expect(propertyIdFormat('106-403-11-121')).toBe('106-403-11-121');
        expect(propertyIdFormat('09208199010000')).toBe('92-81-9901-0');
    });

    it('should return correct save data format', () => {
        const propertyData = {
            features: [{
                properties: {
                    landArea: 10,
                    municipalityName: 'Kunta',
                    name: 'nimi',
                    parcelCount: 2,
                    propertyIdentifier: '98-433-4-26',
                    registerUnitTypeId: 4,
                    registrationDate: '2017-01-02',
                },
                geometry: {
                    coordinates: [[
                        [480224.917, 7168895.858],
                        [480350.602, 7168904.011],
                        [480239.3, 7169038.353],
                        [480128.111, 7169117.832],
                        [480089.409, 7169086.206],
                        [480132.002, 7168974.071],
                        [480224.917, 7168895.858],
                    ]],
                    type: 'MultiPolygon',
                },
            }],
        };

        const expectResult = [{
            attributes: {
                LAND_AREA: 10,
                MANAGEMENT_AREA: 0,
                MUNICIPALITY_NAME: 'Kunta',
                NAME: 'nimi',
                PARCEL_COUNT: 2,
                PROPERTY_ID: '98-433-4-26',
                REGISTER_UNIT_TYPE: 4,
                REGISTRATION_DATE: '2017-01-02',
            },
            geometry: {
                rings: [[
                    [480224.917, 7168895.858],
                    [480350.602, 7168904.011],
                    [480239.3, 7169038.353],
                    [480128.111, 7169117.832],
                    [480089.409, 7169086.206],
                    [480132.002, 7168974.071],
                    [480224.917, 7168895.858],
                ]],
                spatialReference: {
                    wkid: 3067,
                },
            },
        }];
        expect(formatPropertyInfoToSaveFormat(propertyData, null)).resolves.toEqual(expectResult);
    });
});
