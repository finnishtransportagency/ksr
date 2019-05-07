import { nestedVal } from '../nestedValue';

describe('nestedValue.js', () => {
    it('nestedVal - should return correct value', () => {
        const obj = {
            user: {
                details: {
                    account: {
                        id: 123,
                    },
                },
            },
        };

        const list1 = ['user'];
        const list2 = ['user', 'details'];
        const list3 = ['user', 'details', 'account'];
        const list4 = ['user', 'details', 'account', 'id'];
        const objList = [{ id: 123, name: 'name 123' }, { id: 456, name: 'name 456' }];
        expect(nestedVal(objList.find(o => o.id === 123), ['name'])).toEqual('name 123');

        expect(nestedVal(obj, list1)).toEqual({ details: { account: { id: 123 } } });
        expect(nestedVal(obj, list2)).toEqual({ account: { id: 123 } });
        expect(nestedVal(obj, list3)).toEqual({ id: 123 });
        expect(nestedVal(obj, list4)).toEqual(123);
        expect(nestedVal(objList.find(o => o.id === 123), ['name'])).toEqual('name 123');
    });

    it('nestedVal - should return null if anything fails', () => {
        const obj = {
            user: {
                details: {
                    account: {
                        id: 123,
                    },
                },
            },
        };
        const obj2 = null;

        const list = ['user', 'doesntexist', 'account', 'id'];
        const objList = [{ id: 123, name: 'name 123' }, { id: 456, name: 'name 456' }];

        expect(nestedVal(obj, list)).toEqual(null);
        expect(nestedVal(obj2, list)).toEqual(null);
        expect(nestedVal(list, obj)).toEqual(null);
        expect(nestedVal('123', obj)).toEqual(null);
        expect(nestedVal(list, 123)).toEqual(null);
        expect(nestedVal(123, 123)).toEqual(null);
        expect(nestedVal(objList.find(o => o.id === 999), ['name'])).toEqual(null);
    });
    it('nestedVal - should return defaultValue if anything fails', () => {
        const obj2 = null;

        const list = ['user', 'doesntexist', 'account', 'id'];
        const objList = [{ id: 123, name: 'name 123' }, { id: 456, name: 'name 456' }];

        expect(nestedVal(obj2, list, true)).toEqual(true);
        expect(nestedVal(obj2, list, 1)).toEqual(1);
        expect(nestedVal(objList.find(o => o.id === 999), ['name'], 'defaultName')).toEqual('defaultName');
    });
});
