INSERT INTO RELATION (LAYER_ID,
                      RELATION_LAYER_ID,
                      RELATION_COLUMN_IN,
                      RELATION_COLUMN_OUT,
                      RELATION_TYPE)
VALUES ((SELECT ID FROM LAYER WHERE LOWER(NAME) = 'turvalaite'),
        (SELECT ID FROM LAYER WHERE LOWER(NAME) = 'tlaite sopimushallinta'),
        'TURVALAITENUMERO',
        'TLNUMERO', 'one')
