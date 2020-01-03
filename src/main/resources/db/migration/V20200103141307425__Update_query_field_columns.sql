UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('CONTRACT_NR', 'CUSTOMER', 'LIST_COMMUNITY', 'VAYLATYYPPI')
WHERE NAME = 'Maanvuokrasopimukset päättyneet'
   OR NAME = 'Maanvuokrasopimukset päättyvät'
   OR NAME = 'Maanvuokrasopimukset tulevat'
   OR NAME = 'Maanvuokrasopimukset voimassaolevat';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('mjtunnus', 'kohdenimi', 'kunta')
WHERE NAME = 'Muinaisjäännökset (alue)'
   OR NAME = 'Muinaisjäännökset (piste)';

UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('kohdeID', 'kohdenimi', 'kunta')
WHERE NAME = 'Rakennussuojelu (alue)'
   OR NAME = 'Rakennussuojelu (piste)';
