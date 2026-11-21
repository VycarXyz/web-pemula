create table if not exists public.video_likes (
  user_id text not null,
  video_key text not null,
  video_src text not null,
  poster_src text,
  collection_name text not null default '',
  credit text not null default '',
  created_at timestamptz not null default now(),
  primary key (user_id, video_key)
);

alter table public.video_likes enable row level security;

revoke all on public.video_likes from anon, authenticated;
grant select, insert, update, delete on public.video_likes to service_role;

drop policy if exists "Users can read their own video likes" on public.video_likes;
drop policy if exists "Users can add their own video likes" on public.video_likes;
drop policy if exists "Users can update their own video likes" on public.video_likes;
drop policy if exists "Users can delete their own video likes" on public.video_likes;
