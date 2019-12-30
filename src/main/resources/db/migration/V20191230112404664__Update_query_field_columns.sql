UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('CONTRACT_NR', 'CUSTOMER', 'LIST_COMMUNITY', 'VAYLATYYPPI')
WHERE NAME = 'Maanvuokrasopimukset päättyneet'
   OR NAME = 'Maanvuokrasopimukset päättyvät'
   OR NAME = 'Maanvuokrasopimukset tulevat'
   OR NAME = 'Maanvuokrasopimukset voimassaolevat';
