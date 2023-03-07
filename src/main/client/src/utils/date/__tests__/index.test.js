import {
    toUnixTime, toISODate, toDisplayDateTime, toDisplayDate,
} from '../index';

const pad = val => (val < 10 ? `0${val}` : `${val}`);

const ISOformat = (date) => {
    const yyyy = date.getFullYear();
    const M = pad(date.getMonth() + 1);
    const d = pad(date.getDate());
    return `${yyyy}-${M}-${d}`;
};

const dateFormat = (date) => {
    const yyyy = date.getFullYear();
    const M = date.getMonth() + 1;
    const d = date.getDate();
    return `${d}.${M}.${yyyy}`;
};

const dateTimeFormat = (date) => {
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${dateFormat(date)} ${hh}:${mm}:${ss}`;
};

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
        const expected = ISOformat(date);
        expect(toISODate(date)).toEqual(expected);
    });

    it('should return ISODate - valid ISO 8601 string', () => {
        const date = new Date('2019-03-11T10:00:00Z');
        const expected = ISOformat(date);
        expect(toISODate('2019-03-11T10:00:00Z')).toEqual(expected);
    });

    it('should return ISODate - valid unix time', () => {
        const date = new Date(1552298400000);
        const expected = ISOformat(date);
        expect(toISODate(1552298400000)).toEqual(expected);
    });

    it('should return ISODate - null date', () => {
        expect(toISODate(null)).toEqual('');
    });

    it('should return ISODate - undefined date', () => {
        expect(toISODate(undefined)).toEqual('');
    });

    it('should display date time - valid date', () => {
        const date = new Date('2019-03-11T10:00:00Z');
        const expected = dateTimeFormat(date);
        expect(toDisplayDateTime(date)).toEqual(expected);
    });

    it('should display date time - valid ISO 8601', () => {
        const date = new Date('2019-03-11T10:00:00Z');
        const expected = dateTimeFormat(date);
        expect(toDisplayDateTime('2019-03-11T10:00:00Z')).toEqual(expected);
    });

    it('should display date time - valid unix time', () => {
        const date = new Date(1552298400000);
        const expected = dateTimeFormat(date);
        expect(toDisplayDateTime(1552298400000)).toEqual(expected);
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
        const expected = dateFormat(date);
        expect(toDisplayDate(date)).toEqual(expected);
    });

    it('should display date - valid ISO 8601', () => {
        const date = new Date('2019-03-11T10:00:00Z');
        const expected = dateFormat(date);
        expect(toDisplayDate('2019-03-11T10:00:00Z')).toEqual(expected);
    });

    it('should display date - valid unix time', () => {
        const date = new Date(1552298400000);
        const expected = dateFormat(date);
        expect(toDisplayDate(1552298400000)).toEqual(expected);
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
