UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('RAK_NRO', 'RAK_NIMI', 'RAK_VUOSI', 'OSOITE', 'POSTINUMER', 'VAYLATYYPPI')
WHERE NAME = 'Rakennukset (kaikki)';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('CONTRACT_NR', 'CUSTOMER', 'LIST_COMMUNITY', 'LIST_PLACE', 'LIST_LOCATION',
                                      'VAYLATYYPPI')
WHERE NAME = 'Maanvuokrasopimukset voimassaolevat'
   OR NAME = 'Maanvuokrasopimukset päättyneet'
   OR NAME = 'Maanvuokrasopimukset tulevat'
   OR NAME = 'Maanvuokrasopimukset päättyvät';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('TLNUMERO', 'OMISTAJA', 'NIMIS', 'SUBTYPE')
WHERE NAME = 'Turvalaite';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('PvAlueTunnus', 'PvAlueNimi', 'PvAlueLuokka', 'Subtype')
WHERE NAME = 'Pohjavesialue';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('mjtunnus', 'kohdenimi', 'kunta', 'laji', 'tyyppi')
WHERE NAME = 'Muinaisjäännökset (piste)';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('mjtunnus', 'kohdenimi', 'kunta', 'laji')
WHERE NAME = 'Muinaisjäännökset (alue)';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('kohdeID', 'kohdenimi', 'kunta', 'suojeluryh')
WHERE NAME = 'Rakennussuojelu (alue)';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('kohdeID', 'kohdenimi', 'rakennusni', 'kunta', 'suojeluryh')
WHERE NAME = 'Rakennussuojelu (piste)';
