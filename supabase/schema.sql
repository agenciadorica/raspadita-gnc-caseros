-- Configuración global (interruptor general de la promoción)
create table config (
  id int primary key default 1,
  activo boolean default true
);
insert into config (id, activo) values (1, true);

-- Parámetros del sorteo progresivo
create table config_sorteo (
  id int primary key default 1,
  probabilidad_base numeric not null default 0.05,
  incremento_por_jugada numeric not null default 0.05
);
insert into config_sorteo (id, probabilidad_base, incremento_por_jugada) values (1, 0.05, 0.05);

-- Franjas horarias (12 franjas de 2hs, cubren las 24hs del día)
create table franjas_horarias (
  id serial primary key,
  hora_inicio int not null,  -- 0, 2, 4, ..., 22
  hora_fin int not null,     -- 2, 4, 6, ..., 24
  premios_cupo int not null default 0,
  activa boolean not null default true
);

insert into franjas_horarias (hora_inicio, hora_fin, premios_cupo) values
(0,2,0),(2,4,0),(4,6,0),(6,8,0),(8,10,0),
(10,12,2),(12,14,0),(14,16,0),(16,18,2),(18,20,0),(20,22,0),(22,24,1);

-- Jugadas
create table jugadas (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null,
  fecha date not null default current_date,
  franja_id int references franjas_horarias(id),
  gano boolean not null default false,
  codigo_premio text,
  canjeado boolean default false,
  created_at timestamptz default now()
);

create index on jugadas (fingerprint, fecha);
create index on jugadas (fecha, gano);
create index on jugadas (fecha, franja_id);
