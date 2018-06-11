alter table layer rename column min_zoom to min_scale;
alter table layer rename column max_zoom to max_scale;
alter table layer modify(max_scale  number(9) default 0);

update layer set min_scale = 70 where min_scale = 23;
update layer set max_scale = 70 where max_scale = 23;

update layer set min_scale = 141 where min_scale = 22;
update layer set max_scale = 141 where max_scale = 22;

update layer set min_scale = 282 where min_scale = 21;
update layer set max_scale = 282 where max_scale = 21;

update layer set min_scale = 564 where min_scale = 20;
update layer set max_scale = 564 where max_scale = 20;

update layer set min_scale = 1128 where min_scale = 19;
update layer set max_scale = 1128 where max_scale = 19;

update layer set min_scale = 2256 where min_scale = 18;
update layer set max_scale = 2256 where max_scale = 18;

update layer set min_scale = 4513 where min_scale = 17;
update layer set max_scale = 4513 where max_scale = 17;

update layer set min_scale = 9027 where min_scale = 16;
update layer set max_scale = 9027 where max_scale = 16;

update layer set min_scale = 18055 where min_scale = 15;
update layer set max_scale = 18055 where max_scale = 15;

update layer set min_scale = 36111 where min_scale = 14;
update layer set max_scale = 36111 where max_scale = 14;

update layer set min_scale = 72223 where min_scale = 13;
update layer set max_scale = 72223 where max_scale = 13;

update layer set min_scale = 144447 where min_scale = 12;
update layer set max_scale = 144447 where max_scale = 12;

update layer set min_scale = 288895 where min_scale = 11;
update layer set max_scale = 288895 where max_scale = 11;

update layer set min_scale = 577790 where min_scale = 10;
update layer set max_scale = 577790 where max_scale = 10;

update layer set min_scale = 1155581 where min_scale = 9;
update layer set max_scale = 1155581 where max_scale = 9;

update layer set min_scale = 2311162 where min_scale = 8;
update layer set max_scale = 2311162 where max_scale = 8;

update layer set min_scale = 4622324 where min_scale = 7;
update layer set max_scale = 4622324 where max_scale = 7;

update layer set min_scale = 9244648 where min_scale = 6;
update layer set max_scale = 9244648 where max_scale = 6;

update layer set min_scale = 18489297 where min_scale = 5;
update layer set max_scale = 18489297 where max_scale = 5;

update layer set min_scale = 36978595 where min_scale = 4;
update layer set max_scale = 36978595 where max_scale = 4;

update layer set min_scale = 73957190 where min_scale = 3;
update layer set max_scale = 73957190 where max_scale = 3;

update layer set min_scale = 147914381 where min_scale = 2;
update layer set max_scale = 147914381 where max_scale = 2;

update layer set min_scale = 295828763 where min_scale = 1;
update layer set max_scale = 295828763 where max_scale = 1;

update layer set min_scale = 591657527 where min_scale = 0;
update layer set max_scale = 591657527 where max_scale = 0;
