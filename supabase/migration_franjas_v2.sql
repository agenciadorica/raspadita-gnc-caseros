-- Migración v2: franjas horarias de 8hs (reemplaza las 12 franjas de 2hs)
-- Ejecutar en el SQL editor de Supabase.

-- Limpiar franjas anteriores
delete from jugadas where franja_id is not null;
delete from franjas_horarias;

-- Insertar las 3 franjas nuevas
insert into franjas_horarias (hora_inicio, hora_fin, premios_cupo) values
(6, 14, 2),   -- Mañana/tarde: 06:00 a 14:00 — 2 premios
(14, 22, 2),  -- Tarde/noche: 14:00 a 22:00 — 2 premios
(22, 6, 0);   -- Noche/madrugada: 22:00 a 06:00 — 0 premios (configurable desde admin)
