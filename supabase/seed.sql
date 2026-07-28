insert into public.tournaments (
  id, name, mode, status, prize_pool, entry_fee, max_teams, registered_teams,
  starts_at, registration_deadline, maps, phase, accent
) values
  (
    'nebula-masters', 'Nebula Masters Invitational', 'Squad TPP', 'LIVE',
    500000, 799, 64, 48, '2026-08-15T13:30:00Z', '2026-08-10T18:29:59Z',
    array['Erangel','Miramar','Sanhok','Vikendi'], 'Grand Finals',
    'from-cyan-400 to-fuchsia-500'
  ),
  (
    'crimson-rift', 'Crimson Rift Pro League', 'Squad FPP', 'REGISTRATION_OPEN',
    250000, 499, 32, 29, '2026-09-02T13:30:00Z', '2026-08-31T18:29:59Z',
    array['Erangel','Livik'], 'League',
    'from-red-500 to-orange-400'
  )
on conflict (id) do update set
  name = excluded.name,
  mode = excluded.mode,
  status = excluded.status,
  prize_pool = excluded.prize_pool,
  entry_fee = excluded.entry_fee,
  max_teams = excluded.max_teams,
  registered_teams = excluded.registered_teams,
  starts_at = excluded.starts_at,
  registration_deadline = excluded.registration_deadline,
  maps = excluded.maps,
  phase = excluded.phase,
  accent = excluded.accent,
  updated_at = now();

insert into public.teams (
  id, tournament_id, name, short_name, region, captain, matches_played, wwcd,
  placement_points, finishes, penalty_points, recent_form, preferred_drop
) values
  ('velocity-reign', 'nebula-masters', 'Velocity Reign', 'VRN', 'Delhi', 'Aarav Blaze', 16, 4, 72, 98, 0, array['W','3','2','W','5'], 'School'),
  ('neon-vipers', 'nebula-masters', 'Neon Vipers', 'NVX', 'Mumbai', 'Rehan Volt', 16, 3, 68, 91, 2, array['2','W','4','7','W'], 'Pochinki'),
  ('iron-phantoms', 'nebula-masters', 'Iron Phantoms', 'IPH', 'Bengaluru', 'Kabir Hex', 16, 2, 61, 86, 0, array['4','2','W','6','3'], 'Rozhok'),
  ('storm-syntax', 'nebula-masters', 'Storm Syntax', 'SSX', 'Hyderabad', 'Ishan Node', 16, 2, 58, 81, 4, array['7','3','5','2','W'], 'Mylta'),
  ('quantum-rush', 'nebula-masters', 'Quantum Rush', 'QRX', 'Pune', 'Dev Cipher', 16, 1, 55, 78, 0, array['5','8','2','W','4'], 'Yasnaya'),
  ('solar-dominion', 'nebula-masters', 'Solar Dominion', 'SDM', 'Kolkata', 'Rudra Nova', 16, 1, 49, 72, 1, array['6','4','8','3','2'], 'Georgopol'),
  ('rogue-circuit', 'nebula-masters', 'Rogue Circuit', 'RGC', 'Chennai', 'Nikhil Flux', 16, 1, 46, 66, 0, array['8','5','6','4','3'], 'Military Base'),
  ('apex-mirage', 'nebula-masters', 'Apex Mirage', 'AMG', 'Jaipur', 'Vihaan Frost', 16, 0, 41, 61, 0, array['9','6','7','5','6'], 'Severny')
on conflict (id) do update set
  tournament_id = excluded.tournament_id,
  name = excluded.name,
  short_name = excluded.short_name,
  region = excluded.region,
  captain = excluded.captain,
  matches_played = excluded.matches_played,
  wwcd = excluded.wwcd,
  placement_points = excluded.placement_points,
  finishes = excluded.finishes,
  penalty_points = excluded.penalty_points,
  recent_form = excluded.recent_form,
  preferred_drop = excluded.preferred_drop,
  updated_at = now();

insert into public.matches (
  id, tournament_id, name, starts_at, map, status, group_name
) values
  ('gf-m1', 'nebula-masters', 'Grand Final M1', '2026-07-28T13:30:00Z', 'Erangel', 'ROOM_RELEASED', 'Group A+B'),
  ('gf-m2', 'nebula-masters', 'Grand Final M2', '2026-07-28T14:20:00Z', 'Miramar', 'CHECK_IN_OPEN', 'Group A+B'),
  ('gf-m3', 'nebula-masters', 'Grand Final M3', '2026-07-29T13:30:00Z', 'Sanhok', 'UPCOMING', 'Group A+B'),
  ('gf-m4', 'nebula-masters', 'Grand Final M4', '2026-07-29T14:20:00Z', 'Vikendi', 'UPCOMING', 'Group A+B')
on conflict (id) do update set
  tournament_id = excluded.tournament_id,
  name = excluded.name,
  starts_at = excluded.starts_at,
  map = excluded.map,
  status = excluded.status,
  group_name = excluded.group_name,
  updated_at = now();

insert into public.announcements (
  id, tournament_id, category, title, body, pinned
) values
  ('ann-important', 'nebula-masters', 'Important', 'Grand finals lobby opens 20 minutes earlier tonight.', 'Grand finals lobby opens 20 minutes earlier tonight.', true),
  ('ann-rules', 'nebula-masters', 'Rules', 'Zone heal camping penalty updated for finals matches.', 'Zone heal camping penalty updated for finals matches.', false),
  ('ann-result', 'nebula-masters', 'Result', 'Semi-final leaderboard verified after payment and roster audit.', 'Semi-final leaderboard verified after payment and roster audit.', false)
on conflict (id) do update set
  tournament_id = excluded.tournament_id,
  category = excluded.category,
  title = excluded.title,
  body = excluded.body,
  pinned = excluded.pinned,
  updated_at = now();
