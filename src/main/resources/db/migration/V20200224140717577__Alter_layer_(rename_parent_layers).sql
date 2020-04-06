UPDATE LAYER
SET NAME = ltrim(rtrim(replace(NAME, '(kaikki)', ' ')))
WHERE lower(NAME) LIKE '%kaikki%';
