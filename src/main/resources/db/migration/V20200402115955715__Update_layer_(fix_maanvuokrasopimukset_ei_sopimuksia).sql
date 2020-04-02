UPDATE LAYER 
SET LAYER_GROUP_ID = (SELECT LAYER_GROUP_ID FROM LAYER WHERE NAME = 'Maanvuokrasopimukset voimassaolevat') 
WHERE NAME = 'Maanvuokrasopimukset ei sopimuksia';

UPDATE LAYER 
SET PARENT_LAYER = (SELECT PARENT_LAYER FROM LAYER WHERE NAME = 'Maanvuokrasopimukset voimassaolevat') 
WHERE NAME = 'Maanvuokrasopimukset ei sopimuksia';
