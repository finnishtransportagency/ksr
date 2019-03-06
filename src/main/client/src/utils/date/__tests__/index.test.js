import {
    toUnixTime, toISODate, toDisplayDateTime, toDisplayDate,
} from '../index';


describe('test - date', () => {
    it('should return unix time - valid date', () => {
        const date = new Date();
        const expected = date.getTime();
        expect(toUnixTime(date)).toEqual(expected);
    });

    it('should return unix time - valid ISO 8601 string', () => {
        expect(toUnixTime('2019-03-11T10:00:00Z')).toEqual(1552298400000);
    });

    it('should return unix time - valid unix time', () => {
        expect(toUnixTime(1552298400000)).toEqual(1552298400000);
    });

    it('should return unix time - null date', () => {
        expect(toUnixTime(null)).toEqual(null);
    });

    it('should return unix time - undefined date', () => {
        expect(toUnixTime(undefined)).toEqual(null);
    });

    it('should return unix time - null date', () => {
        expect(toUnixTime(null)).toEqual(null);
    });

    it('should return unix time - invalid date', () => {
        expect(toUnixTime('k')).toEqual(null);
    });

    it('should return ISODate - valid date', () => {
        const date = new Date('2019-03-11T10:00:00Z');
        expect(toISODate(date)).toEqual('2019-03-11');
    });

    it('should return ISODate - valid ISO 8601 string', () => {
        expect(toISODate('2019-03-11T10:00:00Z')).toEqual('2019-03-11');
    });

    it('should return ISODate - valid unix time', () => {
        expect(toISODate(1552298400000)).toEqual('2019-03-11');
    });

    it('should return ISODate - null date', () => {
        expect(toISODate(null)).toEqual('');
    });

    it('should return ISODate - undefined date', () => {
        expect(toISODate(undefined)).toEqual('');
    });

    it('should display date time - valid date', () => {
        const date = new Date('2019-03-11T10:00:00Z');
        expect(toDisplayDateTime(date)).toEqual('11.3.2019 12:00:00');
    });

    it('should display date time - valid ISO 8601', () => {
        expect(toDisplayDateTime('2019-03-11T10:00:00Z')).toEqual('11.3.2019 12:00:00');
    });

    it('should display date time - valid unix time', () => {
        expect(toDisplayDateTime(1552298400000)).toEqual('11.3.2019 12:00:00');
    });

    it('should display date time - invalid date', () => {
        expect(toDisplayDateTime('k')).toEqual('');
    });

    it('should display date time - null date', () => {
        expect(toDisplayDateTime(null)).toEqual('');
    });

    it('should display date time - undefined date', () => {
        expect(toDisplayDateTime(undefined)).toEqual('');
    });

    it('should display date - valid date', () => {
        const date = new Date('2019-03-11T10:00:00Z');
        expect(toDisplayDate(date)).toEqual('11.3.2019');
    });

    it('should display date - valid ISO 8601', () => {
        expect(toDisplayDate('2019-03-11T10:00:00Z')).toEqual('11.3.2019');
    });

    it('should display date - valid unix time', () => {
        expect(toDisplayDate(1552298400000)).toEqual('11.3.2019');
    });

    it('should display date - invalid date', () => {
        expect(toDisplayDate('k')).toEqual('');
    });

    it('should display date - null date', () => {
        expect(toDisplayDate(null)).toEqual('');
    });

    it('should display date - undefined date', () => {
        expect(toDisplayDate(undefined)).toEqual('');
    });
});
