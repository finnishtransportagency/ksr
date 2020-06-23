INSERT INTO LAYER (NAME, TYPE, URL, LAYERS, STYLES, OPACITY, AUTHENTICATION, LAYER_ORDER, MIN_SCALE, MAX_SCALE, LAYER_GROUP_ID, TRANSPARENT, ATTRIBUTION, DESKTOP_VISIBLE, MOBILE_VISIBLE, QUERYABLE, QUERY_COLUMNS, USE_INTERNAL_PROXY, ADDRESS_FIELD, FEATURE_TYPE, UPDATER_FIELD, CONTRACT_ID_FIELD, CONTRACT_DESCRIPTION_FIELD, ALFRESCO_LINK_FIELD, CASE_MANAGEMENT_LINK_FIELD, BACKGROUND, PARENT_LAYER, PROPERTY_ID_FIELD, REQUIRED_UNIQUE_FIELDS) 
VALUES ('Ratojen kunnossapitoalueet', 'agfs', 'http://172.17.214.144/arcgis/rest/services/dev/Ratojen_kunnossapitoalueet/FeatureServer/0', null, 'default', 1.0, null, 13000, 577790, 0, (SELECT ID FROM LAYER_group WHERE NAME = 'Väylien rakennukset ja sopimukset'), '0', 'Väylä', '0', '0', '1', QUERY_COLUMN_TYPE('ASEMA', 'VASTAAVA', 'KUNNOSSAPI', 'PÄIVITETT', 'SOPIMUSNRO', 'KUNTA'), '0', null, null, null, null, null, null, null, '0', null, null, null);

INSERT INTO LAYER_PERMISSION (LAYER_ID, USER_GROUP, CREATE_LAYER, READ_LAYER, UPDATE_LAYER, DELETE_LAYER) VALUES ((SELECT ID FROM LAYER WHERE NAME = 'Ratojen kunnossapitoalueet'), 'KSR_ROLE_ADMIN', '0', '1', '0', '0');
INSERT INTO LAYER_PERMISSION (LAYER_ID, USER_GROUP, CREATE_LAYER, READ_LAYER, UPDATE_LAYER, DELETE_LAYER) VALUES ((SELECT ID FROM LAYER WHERE NAME = 'Ratojen kunnossapitoalueet'), 'KSR_ROLE_UPDATER', '0', '1', '0', '0');
INSERT INTO LAYER_PERMISSION (LAYER_ID, USER_GROUP, CREATE_LAYER, READ_LAYER, UPDATE_LAYER, DELETE_LAYER) VALUES ((SELECT ID FROM LAYER WHERE NAME = 'Ratojen kunnossapitoalueet'), 'KSR_ROLE_EXTERNAL_UPDATER', '0', '1', '0', '0');
INSERT INTO LAYER_PERMISSION (LAYER_ID, USER_GROUP, CREATE_LAYER, READ_LAYER, UPDATE_LAYER, DELETE_LAYER) VALUES ((SELECT ID FROM LAYER WHERE NAME = 'Ratojen kunnossapitoalueet'), 'KSR_ROLE_NAMED_USER', '0', '1', '0', '0');
INSERT INTO LAYER_PERMISSION (LAYER_ID, USER_GROUP, CREATE_LAYER, READ_LAYER, UPDATE_LAYER, DELETE_LAYER) VALUES ((SELECT ID FROM LAYER WHERE NAME = 'Ratojen kunnossapitoalueet'), 'KSR_ROLE_USER', '0', '1', '0', '0');
