-- Add email preferences and analytics tracking to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_notifications_referrals boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS email_notifications_credits boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS email_notifications_features boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS lifetime_access boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS total_ideas_generated integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Create table for tracking credit purchases
CREATE TABLE IF NOT EXISTS public.credit_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  credits integer NOT NULL,
  amount_paid integer NOT NULL,
  stripe_session_id text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.credit_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
ON public.credit_purchases
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
ON public.credit_purchases
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create table for social proof events
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_display_name text NOT NULL,
  action_type text NOT NULL,
  platform text,
  niche text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- Everyone can read activity feed (for social proof)
CREATE POLICY "Anyone can read activity feed"
ON public.activity_feed
FOR SELECT
USING (true);

-- System inserts via service role
CREATE POLICY "System can insert activity"
ON public.activity_feed
FOR INSERT
WITH CHECK (true);

-- Create content calendar table
CREATE TABLE IF NOT EXISTS public.content_calendar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  idea_id uuid REFERENCES public.saved_ideas(id) ON DELETE SET NULL,
  title text NOT NULL,
  scheduled_date date NOT NULL,
  platform text NOT NULL,
  status text DEFAULT 'scheduled',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.content_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own calendar"
ON public.content_calendar
FOR ALL
USING (auth.uid() = user_id);

-- Enable realtime for activity feed
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_feed;