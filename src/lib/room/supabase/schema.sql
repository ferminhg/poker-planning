-- src/lib/room/supabase/schema.sql
create table if not exists rooms (
  id text primary key,
  current_story text not null default '',
  votes_revealed boolean not null default false,
  max_participants integer not null default 10,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists participants (
  id text not null,
  room_id text not null references rooms(id) on delete cascade,
  name text not null,
  received_emojis jsonb default '[]',
  joined_at timestamptz not null default now(),
  primary key (id, room_id)
);

create table if not exists votes (
  participant_id text not null,
  room_id text not null references rooms(id) on delete cascade,
  vote_value text not null,
  voted_at timestamptz not null default now(),
  primary key (participant_id, room_id),
  foreign key (participant_id, room_id) references participants(id, room_id) on delete cascade
);

-- Habilitar Realtime en las tablas relevantes
-- Nota: Si las tablas ya están en la publicación, estas líneas fallarán; puedes omitirlas o ejecutarlas desde el Dashboard de Supabase (Database > Publications > supabase_realtime)
alter publication supabase_realtime add table rooms;
alter publication supabase_realtime add table participants;
alter publication supabase_realtime add table votes;
