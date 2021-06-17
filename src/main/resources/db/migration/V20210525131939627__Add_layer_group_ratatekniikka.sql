INSERT INTO LAYER_GROUP (ID, NAME, GROUP_ORDER) VALUES (null, 'Ratatekniikka', ((select max(GROUP_ORDER) from LAYER_GROUP) + 1));
