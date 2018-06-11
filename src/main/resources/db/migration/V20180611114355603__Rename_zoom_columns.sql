ALTER TABLE layer RENAME COLUMN min_zoom TO min_scale;
ALTER TABLE layer RENAME COLUMN max_zoom TO max_scale;
ALTER TABLE layer MODIFY(max_scale  number(9) default 0);

UPDATE layer SET min_scale = 70 WHERE min_scale = 23;
UPDATE layer SET max_scale = 70 WHERE max_scale = 23;

UPDATE layer SET min_scale = 141 WHERE min_scale = 22;
UPDATE layer SET max_scale = 141 WHERE max_scale = 22;

UPDATE layer SET min_scale = 282 WHERE min_scale = 21;
UPDATE layer SET max_scale = 282 WHERE max_scale = 21;

UPDATE layer SET min_scale = 564 WHERE min_scale = 20;
UPDATE layer SET max_scale = 564 WHERE max_scale = 20;

UPDATE layer SET min_scale = 1128 WHERE min_scale = 19;
UPDATE layer SET max_scale = 1128 WHERE max_scale = 19;

UPDATE layer SET min_scale = 2256 WHERE min_scale = 18;
UPDATE layer SET max_scale = 2256 WHERE max_scale = 18;

UPDATE layer SET min_scale = 4513 WHERE min_scale = 17;
UPDATE layer SET max_scale = 4513 WHERE max_scale = 17;

UPDATE layer SET min_scale = 9027 WHERE min_scale = 16;
UPDATE layer SET max_scale = 9027 WHERE max_scale = 16;

UPDATE layer SET min_scale = 18055 WHERE min_scale = 15;
UPDATE layer SET max_scale = 18055 WHERE max_scale = 15;

UPDATE layer SET min_scale = 36111 WHERE min_scale = 14;
UPDATE layer SET max_scale = 36111 WHERE max_scale = 14;

UPDATE layer SET min_scale = 72223 WHERE min_scale = 13;
UPDATE layer SET max_scale = 72223 WHERE max_scale = 13;

UPDATE layer SET min_scale = 144447 WHERE min_scale = 12;
UPDATE layer SET max_scale = 144447 WHERE max_scale = 12;

UPDATE layer SET min_scale = 288895 WHERE min_scale = 11;
UPDATE layer SET max_scale = 288895 WHERE max_scale = 11;

UPDATE layer SET min_scale = 577790 WHERE min_scale = 10;
UPDATE layer SET max_scale = 577790 WHERE max_scale = 10;

UPDATE layer SET min_scale = 1155581 WHERE min_scale = 9;
UPDATE layer SET max_scale = 1155581 WHERE max_scale = 9;

UPDATE layer SET min_scale = 2311162 WHERE min_scale = 8;
UPDATE layer SET max_scale = 2311162 WHERE max_scale = 8;

UPDATE layer SET min_scale = 4622324 WHERE min_scale = 7;
UPDATE layer SET max_scale = 4622324 WHERE max_scale = 7;

UPDATE layer SET min_scale = 9244648 WHERE min_scale = 6;
UPDATE layer SET max_scale = 9244648 WHERE max_scale = 6;

UPDATE layer SET min_scale = 18489297 WHERE min_scale = 5;
UPDATE layer SET max_scale = 18489297 WHERE max_scale = 5;

UPDATE layer SET min_scale = 36978595 WHERE min_scale = 4;
UPDATE layer SET max_scale = 36978595 WHERE max_scale = 4;

UPDATE layer SET min_scale = 73957190 WHERE min_scale = 3;
UPDATE layer SET max_scale = 73957190 WHERE max_scale = 3;

UPDATE layer SET min_scale = 147914381 WHERE min_scale = 2;
UPDATE layer SET max_scale = 147914381 WHERE max_scale = 2;

UPDATE layer SET min_scale = 295828763 WHERE min_scale = 1;
UPDATE layer SET max_scale = 295828763 WHERE max_scale = 1;

UPDATE layer SET min_scale = 591657527 WHERE min_scale = 0;
UPDATE layer SET max_scale = 591657527 WHERE max_scale = 0;