alter table layer add (parent_layer_temp number(10) references layer(id));
update layer set parent_layer_temp = parent_layer;
alter table layer drop column parent_layer;
alter table layer rename column parent_layer_temp to parent_layer;
