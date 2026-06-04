-- Configuración global
create table config (
  id int primary key default 1,
  premios_por_dia int default 8,
  activo boolean default true
);
insert into config values (1, 8, true);

-- Jugadas
create table jugadas (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null,
  fecha date not null default current_date,
  gano boolean not null default false,
  codigo_premio text,
  canjeado boolean default false,
  created_at timestamptz default now()
);

create index on jugadas (fingerprint, fecha);
create index on jugadas (fecha, gano);
