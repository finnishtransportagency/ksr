INSERT INTO LAYER_GROUP (ID, NAME, GROUP_ORDER) VALUES (null, 'Tierekisteri', ((select max(GROUP_ORDER) from LAYER_GROUP) + 1));
