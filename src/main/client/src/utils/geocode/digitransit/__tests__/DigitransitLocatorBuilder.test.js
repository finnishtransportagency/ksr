import esriLoader from 'esri-loader';
import { when } from 'jest-when';
import DigitransitLocatorBuilder from '../DigitransitLocatorBuilder';
import { fetchAddresses } from '../api';
import { addToCache } from '../cache';

jest.mock('esri-loader');
jest.mock('../api');

class LocatorMock {
    constructor(params) {
        Object.entries(params).forEach(([key, value]) => {
            this[key] = value;
        });
    }

    static createSubclass(params) {
        return new LocatorMock(params);
    }
}

const promiseUtils = { create: executor => new Promise(executor) };

describe('digitransit - DigitransitLocatorBuilder', () => {
    beforeAll(() => {
        esriLoader.loadModules.mockResolvedValue([LocatorMock, promiseUtils]);
        when(fetchAddresses)
            .calledWith('Helsinki', 2)
            .mockResolvedValue([
                {
                    isCollection: false,
                    text: 'Helsinki',
                    address: 'Helsinki',
                    magicKey: '123',
                    location: null,
                    score: 100,
                },
                {
                    isCollection: false,
                    text: 'Helsinginkatu',
                    address: 'Helsinginkatu',
                    magicKey: '124',
                    location: null,
                    score: 90,
                },
            ]);

        addToCache([
            {
                isCollection: false,
                text: 'Espoo',
                address: 'Espoo',
                magicKey: 'abc',
                location: null,
                score: 100,
            },
        ]);
    });

    it('should build a DigitransitLocator', async () => {
        const DigitransitLocator = await DigitransitLocatorBuilder.build();
        expect(typeof DigitransitLocator).toBe('object');
    });

    it('should have method <addressToLocations>', async () => {
        const DigitransitLocator = await DigitransitLocatorBuilder.build();
        expect(typeof DigitransitLocator.addressToLocations).toBe('function');
    });

    it('should have method <suggestLocations>', async () => {
        const DigitransitLocator = await DigitransitLocatorBuilder.build();
        expect(typeof DigitransitLocator.suggestLocations).toBe('function');
    });

    it('should suggest locations', async () => {
        const DigitransitLocator = await DigitransitLocatorBuilder.build();
        const result = await DigitransitLocator.suggestLocations({
            text: 'Helsinki',
            maxSuggestions: 2,
        });
        expect(result).toMatchObject([
            {
                isCollection: false,
                text: 'Helsinki',
                address: 'Helsinki',
                magicKey: '123',
                location: null,
                score: 100,
            },
            {
                isCollection: false,
                text: 'Helsinginkatu',
                address: 'Helsinginkatu',
                magicKey: '124',
                location: null,
                score: 90,
            },
        ]);
    });

    it('should convert addressToLocations, not from cache', async () => {
        const DigitransitLocator = await DigitransitLocatorBuilder.build();
        const params = {
            address: { 'Single Line Input': 'Helsinki' },
            maxLocations: 2,
            magicKey: undefined,
        };

        const result = await DigitransitLocator.addressToLocations(params);
        expect(result).toMatchObject([
            {
                isCollection: false,
                text: 'Helsinki',
                address: 'Helsinki',
                magicKey: '123',
                location: null,
                score: 100,
            },
            {
                isCollection: false,
                text: 'Helsinginkatu',
                address: 'Helsinginkatu',
                magicKey: '124',
                location: null,
                score: 90,
            },
        ]);
    });

    it('should convert addressToLocations, from cache', async () => {
        const DigitransitLocator = await DigitransitLocatorBuilder.build();
        const params = {
            maxLocations: 2,
            magicKey: 'abc',
        };

        const result = await DigitransitLocator.addressToLocations(params);
        expect(result).toMatchObject([
            {
                isCollection: false,
                text: 'Espoo',
                address: 'Espoo',
                magicKey: 'abc',
                location: null,
                score: 100,
            },
        ]);
    });
});
