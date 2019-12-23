alter table layer
    add (
        locate_visible char(1) default '0' not null
            check (locate_visible in ('0', '1'))
);

COMMENT ON COLUMN "LAYER"."LOCATE_VISIBLE" IS 'Whether the locate-icon is visible on contract pop-up.';

UPDATE LAYER SET LOCATE_VISIBLE = 1 WHERE LOWER(name) = 'maanvuokrasopimukset (kaikki)';

UPDATE LAYER SET LOCATE_VISIBLE = 1 WHERE LOWER(name) = 'rakennukset (kaikki)';
