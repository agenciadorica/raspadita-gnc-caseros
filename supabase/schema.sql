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

-- Franjas horarias (3 franjas de 8hs, cubren las 24hs del día; 22-6 cruza medianoche)
create table franjas_horarias (
  id serial primary key,
  hora_inicio int not null,  -- 6, 14, 22
  hora_fin int not null,     -- 14, 22, 6
  premios_cupo int not null default 0,
  activa boolean not null default true
);

insert into franjas_horarias (hora_inicio, hora_fin, premios_cupo) values
(6,14,2),(14,22,2),(22,6,0);

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
