INSERT INTO LAYER (NAME, TYPE, URL, LAYERS, STYLES, OPACITY, AUTHENTICATION, LAYER_ORDER, MIN_SCALE, MAX_SCALE, LAYER_GROUP_ID, TRANSPARENT, ATTRIBUTION, DESKTOP_VISIBLE, MOBILE_VISIBLE, QUERYABLE, QUERY_COLUMNS, USE_INTERNAL_PROXY, ADDRESS_FIELD, FEATURE_TYPE, UPDATER_FIELD, RELATION_LAYER_ID, RELATION_COLUMN_IN, RELATION_COLUMN_OUT, RELATION_TYPE, CONTRACT_ID_FIELD, CONTRACT_DESCRIPTION_FIELD, ALFRESCO_LINK_FIELD, CASE_MANAGEMENT_LINK_FIELD, BACKGROUND, PARENT_LAYER, PROPERTY_ID_FIELD)
VALUES ('Tlaite Sopimushallinta', 'agfl', 'http://172.17.214.144/arcgis/rest/services/dev/safety_device/FeatureServer/4', 'SAFETY_DEVICE_CONTRACT_MNGMNT', 'default', 1.0, null, 3004, 0, 0, (SELECT ID FROM LAYER_GROUP WHERE LOWER(NAME) = 'vesiväylien turvalaitteet'), '0', 'Väylä', '0', '0', '1', QUERY_COLUMN_TYPE('TURVALAITENUMERO','NIMI','TYYPPI','PIIRI'), '0', null, null, 'LAST_EDITED_USER', (SELECT ID FROM LAYER WHERE LOWER(NAME) = 'tlaite - sopimus linkki'), 'SAFETY_DEVICE_NUMBER', 'TURVALAITENUMERO', 'many', 'TURVALAITENUMERO', 'NIMI', null, null, '0', null, null);

insert into layer_permission (layer_id, user_group, create_layer, read_layer, update_layer, delete_layer)
values ((select max(id) from layer), 'KSR_ROLE_ADMIN', 1, 1, 1, 1);

insert into layer_permission (layer_id, user_group, create_layer, read_layer, update_layer, delete_layer)
values ((select max(id) from layer), 'KSR_ROLE_UPDATER', 1, 1, 1, 1);

insert into layer_permission (layer_id, user_group, create_layer, read_layer, update_layer, delete_layer)
values ((select max(id) from layer), 'KSR_ROLE_EXTERNAL_UPDATER', 1, 1, 1, 1);

insert into layer_permission (layer_id, user_group, create_layer, read_layer, update_layer, delete_layer)
values ((select max(id) from layer), 'KSR_ROLE_NAMED_USER', 0, 1, 0, 0);

insert into layer_permission (layer_id, user_group, create_layer, read_layer, update_layer, delete_layer)
values ((select max(id) from layer), 'KSR_ROLE_USER', 0, 1, 0, 0);
