UPDATE LAYER
SET UPDATER_FIELD = 'LAST_EDITED_USER'
WHERE NAME = 'Ratojen kunnossapitoalueet';

UPDATE LAYER_PERMISSION
SET CREATE_LAYER = 1, READ_LAYER = 1, UPDATE_LAYER = 1, DELETE_LAYER = 1
WHERE LAYER_ID in (SELECT ID FROM LAYER WHERE NAME = 'Ratojen kunnossapitoalueet')
AND (USER_GROUP ='KSR_ROLE_ADMIN' OR USER_GROUP ='KSR_ROLE_UPDATER' OR USER_GROUP ='KSR_ROLE_EXTERNAL_UPDATER');