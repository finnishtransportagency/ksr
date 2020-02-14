UPDATE LAYER
SET QUERY_COLUMNS = QUERY_COLUMN_TYPE('RAK_NRO', 'RAK_NIMI', 'RAK_VUOSI', 'OSOITE', 'POSTINUMER', 'VAYLATYYPPI')
WHERE NAME = 'Rakennukset voimassaolevat'
   OR NAME = 'Rakennukset päättyneet'
   OR NAME = 'Rakennukset tulevat'
   OR NAME = 'Rakennukset päättyvät';
