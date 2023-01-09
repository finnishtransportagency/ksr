import indexedDB from 'fake-indexeddb';
import IDBDatabase from 'fake-indexeddb/lib/FDBDatabase';
import OfflineCache from 'sw-offline-cache';
import { handleFailedEdit, loadFailedEdits, removeEdits, retryEdits } from '../actions';

describe.skip('offline - actions', () => {
    const setup = () => {
        window.indexedDB = indexedDB;
        window.IDBDatabase = IDBDatabase;
    };

    const clearDb = async () => {
        const db = new OfflineCache('KSR_OFFLINE', 1);
        await db.open();
        const edits = await db.getAllEdits(true);
        await Promise.all(edits.map(edit => db.removeEdit(edit.key)));
        return await db.close();
    };

    it('should handleFailedEdits', () => {
        setup();
        const dispatch = jest.fn();
        return handleFailedEdit('add', [23, 'asdf'])(dispatch)
            .then(() => {
                expect(dispatch.mock.calls.length).toBe(1);
            });
    });

    it('should load failed edits', async () => {
        setup();
        const dispatch = jest.fn();
        await clearDb();

        return handleFailedEdit('add', [23, 'edit1'])(jest.fn())
            .then(() => handleFailedEdit('add', [32, 'edit2'])(jest.fn()))
            .then(() => loadFailedEdits()(dispatch))
            .then(() => {
                expect(dispatch.mock.calls[0][0].count).toBe(2);
            });
    });

    it('should remove all edits', async () => {
        setup();
        const dispatch = jest.fn();
        await clearDb();

        return handleFailedEdit('add', [23, 'edit1'])(jest.fn())
            .then(() => handleFailedEdit('add', [32, 'edit2'])(jest.fn()))
            .then(() => removeEdits()(dispatch))
            .then(() => {
                expect(dispatch.mock.calls[0][0].count).toBe(0);
            });
    });

    it('should retryEdits', async () => {
        setup();
        await clearDb();

        await handleFailedEdit('add', [23, 'edit1'])(jest.fn());
        await handleFailedEdit('add', [23, 'edit2'])(jest.fn());

        fetch.resetMocks();
        fetch.mockResponse(JSON.stringify(true));

        const dispatch = jest.fn();

        return retryEdits()(dispatch)
            .then(() => {
                expect(dispatch.mock.calls[0][0].count).toBe(0);
            });
    });
});
