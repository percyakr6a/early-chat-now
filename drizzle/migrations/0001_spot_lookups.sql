CREATE TABLE public.spot_lookups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  batch_input text NOT NULL DEFAULT '',
  roll_input text NOT NULL DEFAULT '',
  found boolean NOT NULL DEFAULT false,
  matched_name text,
  session_no integer,
  session_date text
);
GRANT ALL ON public.spot_lookups TO service_role;
ALTER TABLE public.spot_lookups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read spot lookups" ON public.spot_lookups FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.spot_lookups TO authenticated;