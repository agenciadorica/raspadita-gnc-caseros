-- Migración: sistema de franjas horarias con premios progresivos
-- Ejecutar en el SQL editor de Supabase sobre la base existente (no destruye datos).

create table if not exists franjas_horarias (
  id serial primary key,
  hora_inicio int not null,
  hora_fin int not null,
  premios_cupo int not null default 0,
  activa boolean not null default true
);

insert into franjas_horarias (hora_inicio, hora_fin, premios_cupo)
select * from (values
  (0,2,0),(2,4,0),(4,6,0),(6,8,0),(8,10,0),
  (10,12,2),(12,14,0),(14,16,0),(16,18,2),(18,20,0),(20,22,0),(22,24,1)
) as v(hora_inicio, hora_fin, premios_cupo)
where not exists (select 1 from franjas_horarias);

create table if not exists config_sorteo (
  id int primary key default 1,
  probabilidad_base numeric not null default 0.05,
  incremento_por_jugada numeric not null default 0.05
);

insert into config_sorteo (id, probabilidad_base, incremento_por_jugada)
values (1, 0.05, 0.05)
on conflict (id) do nothing;

alter table jugadas add column if not exists franja_id int references franjas_horarias(id);

create index if not exists jugadas_fecha_franja_idx on jugadas (fecha, franja_id);

-- La columna premios_por_dia de `config` queda en desuso (reemplazada por franjas_horarias).
alter table config drop column if exists premios_por_dia;
