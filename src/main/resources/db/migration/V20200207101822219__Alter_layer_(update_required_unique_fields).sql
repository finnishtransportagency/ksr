-- Update required unique fields for all layers

UPDATE LAYER
SET REQUIRED_UNIQUE_FIELDS = QUERY_COLUMN_TYPE('RAK_NRO')
WHERE NAME = 'Rakennukset (kaikki)';

UPDATE LAYER
SET REQUIRED_UNIQUE_FIELDS = QUERY_COLUMN_TYPE('CONTRACT_NR')
WHERE NAME = 'Sopimukset';

UPDATE LAYER
SET REQUIRED_UNIQUE_FIELDS = QUERY_COLUMN_TYPE('CUSTOMER_ID')
WHERE NAME = 'Asiakkaat';
