ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_cop integer;
UPDATE public.services SET price_cop = CASE slug
  WHEN 'desarrollo-web' THEN 1500000
  WHEN 'mantenimiento' THEN 90000
  WHEN 'conexiones-redes' THEN 250000
  WHEN 'servicios-computacionales' THEN 120000
  ELSE NULL END;

CREATE TYPE public.app_role AS ENUM ('admin', 'funcionario');
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  service_id uuid NOT NULL REFERENCES public.services(id),
  location text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  notes text,
  estimated_price integer,
  deposit_amount integer,
  deposit_status text NOT NULL DEFAULT 'pendiente',
  status text NOT NULL DEFAULT 'pendiente',
  assigned_to uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own bookings read" ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'funcionario') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Own bookings insert" ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pendiente' AND assigned_to IS NULL AND deposit_status = 'pendiente');
CREATE POLICY "Staff update bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'funcionario') OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'funcionario') OR public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER bookings_touch BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();