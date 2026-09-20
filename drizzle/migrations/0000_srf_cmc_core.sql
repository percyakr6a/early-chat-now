-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  batch_year text NOT NULL DEFAULT '',
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Profile auto-creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, batch_year, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'batch_year', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sessions
CREATE TABLE public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  kicker text NOT NULL,
  date_label text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  note text,
  meta text NOT NULL,
  capacity integer,
  registration_open boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.sessions TO anon, authenticated;
GRANT ALL ON public.sessions TO service_role;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sessions are public" ON public.sessions FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage sessions" ON public.sessions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.session_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.sessions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.session_registrations TO authenticated;
GRANT ALL ON public.session_registrations TO service_role;
ALTER TABLE public.session_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own registrations" ON public.session_registrations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins read all registrations" ON public.session_registrations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users create own registrations" ON public.session_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own registrations" ON public.session_registrations FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Public seat counts without exposing who registered
CREATE OR REPLACE FUNCTION public.session_seat_counts()
RETURNS TABLE (session_id uuid, taken bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, count(r.id)
  FROM public.sessions s
  LEFT JOIN public.session_registrations r ON r.session_id = s.id
  GROUP BY s.id
$$;
GRANT EXECUTE ON FUNCTION public.session_seat_counts() TO anon, authenticated;

-- Journal
CREATE TABLE public.journal_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kicker text NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  author text NOT NULL,
  published_on date NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.journal_posts TO anon, authenticated;
GRANT ALL ON public.journal_posts TO service_role;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Journal is public" ON public.journal_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage journal" ON public.journal_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Core team
CREATE TABLE public.core_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text NOT NULL,
  initials text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.core_members TO anon, authenticated;
GRANT ALL ON public.core_members TO service_role;
ALTER TABLE public.core_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Core members are public" ON public.core_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage core members" ON public.core_members FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed content
INSERT INTO public.sessions (slug, kicker, date_label, title, description, note, meta, capacity, registration_open, sort_order) VALUES
('bls-project', 'BLS / OPEN REGISTRATIONS', '7 OCTOBER / 9:00 AM – 2:00 PM', 'THE BLS PROJECT', 'Designed to introduce BLS CPR to Chandka with the objective of having it accessibly learned by everyone on-campus.', 'Limited 25 slots available per session.', 'Project / CMC Larkana', 25, true, 1),
('research-discourse', 'RESEARCH DISCOURSE', 'AFTER 7 OCTOBER / DATE TBA', 'Research discourse in journal club', 'Discuss the study we created out of this BLS workshop.', NULL, 'Journal club / CMC Larkana', NULL, true, 2);

INSERT INTO public.journal_posts (kicker, title, excerpt, author, published_on, sort_order) VALUES
('FIELD NOTE / 04', 'How to read a paper when you only have twenty minutes', 'A practical reading protocol for the space between a lecture and your next posting.', 'SRF Editorial', '2026-09-06', 1),
('METHODS', 'The question before the question', 'The first draft of every good study starts before the search bar.', 'Meera Nair', '2026-08-29', 2),
('VOICES', 'Research is a team sport', 'Notes from our first cross-batch working session.', 'Community Desk', '2026-08-14', 3);

INSERT INTO public.core_members (name, role_title, initials, sort_order) VALUES
('Musadiq Kalhoro', 'Founding Convener / Y3 MBBS', 'MK', 1),
('XYZ', 'Organising Core Head / Y4 MBBS', 'XY', 2),
('To be announced', 'Organising Core Co-head', '—', 3),
('To be announced', 'Organising Core Associate', '—', 4),
('ABC', 'Media Core Head / Y2 MBBS', 'AB', 5),
('To be announced', 'Media Core Co-head', '—', 6),
('To be announced', 'Media Core Associate', '—', 7),
('XYC', 'Research Core Head / Y4 MBBS', 'XC', 8),
('To be announced', 'Research Core Co-head', '—', 9),
('To be announced', 'Research Core Associate', '—', 10);
