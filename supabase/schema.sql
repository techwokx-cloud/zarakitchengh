-- Zara Kitchen Content Dashboard - Supabase Schema

-- 1. Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin', -- admin, content_creator, moderator
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Generated Content Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  content TEXT,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  post_type VARCHAR(50), -- text, image, video, carousel
  status VARCHAR(50) DEFAULT 'draft', -- draft, approved, scheduled, published, failed
  created_by UUID REFERENCES admin_users(id),
  approved_by UUID REFERENCES admin_users(id),
  scheduled_date TIMESTAMP,
  published_date TIMESTAMP,
  ai_model VARCHAR(100), -- dalle3, stable-diffusion, groq, google-ai, genspark
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Social Media Specific Fields
  facebook_post_id VARCHAR(255),
  instagram_post_id VARCHAR(255),
  tiktok_post_id VARCHAR(255),
  twitter_post_id VARCHAR(255),
  whatsapp_message_id VARCHAR(255),
  
  -- Analytics
  views INT DEFAULT 0,
  likes INT DEFAULT 0,
  shares INT DEFAULT 0,
  comments INT DEFAULT 0,
  engagement_rate DECIMAL(5,2)
);

-- 3. Ghana Holidays Calendar
CREATE TABLE ghana_holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  date DATE UNIQUE,
  category VARCHAR(50), -- religious, national, cultural, business
  description TEXT,
  content_generated BOOLEAN DEFAULT FALSE,
  generated_content_id UUID REFERENCES posts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Content Prompts (Templates)
CREATE TABLE content_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255),
  category VARCHAR(50), -- happy-month, holiday, promotion, event, engagement
  ai_prompt TEXT,
  image_prompt TEXT,
  video_prompt TEXT,
  hashtags TEXT, -- JSON array
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. AI API Keys (Encrypted)
CREATE TABLE ai_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service VARCHAR(100), -- openai, stable-diffusion, groq, google-ai, fal-ai, genspark
  api_key TEXT ENCRYPTED, -- Supabase will encrypt this
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Social Media Accounts
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50), -- facebook, instagram, tiktok, twitter, whatsapp
  account_name VARCHAR(255),
  access_token TEXT ENCRYPTED,
  refresh_token TEXT ENCRYPTED,
  account_id VARCHAR(255),
  is_connected BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Engagement Tools (Polls, Quizzes, Giveaways)
CREATE TABLE engagement_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50), -- poll, quiz, giveaway, question
  title VARCHAR(255),
  content TEXT,
  options JSONB, -- For poll/quiz options
  scheduled_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'draft',
  responses INT DEFAULT 0,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Lead Generation Tracking
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  source VARCHAR(100), -- facebook, instagram, tiktok, twitter, whatsapp, direct
  message TEXT,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, converted, lost
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Analytics & Metrics
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id),
  platform VARCHAR(50),
  metric_date DATE,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  engagement INT DEFAULT 0,
  shares INT DEFAULT 0,
  conversions INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Monthly Content Calendar
CREATE TABLE content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE, -- First day of month
  theme VARCHAR(255), -- e.g., "Happy New Month - August"
  total_posts INT DEFAULT 30,
  posts_created INT DEFAULT 0,
  posts_published INT DEFAULT 0,
  engagement_target INT DEFAULT 1000,
  actual_engagement INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_date ON posts(published_date);
CREATE INDEX idx_posts_platform ON posts(facebook_post_id, instagram_post_id, tiktok_post_id);
CREATE INDEX idx_ghana_holidays_date ON ghana_holidays(date);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_analytics_post_id ON analytics(post_id);

-- Policies (Row Level Security)
-- Only admin can see/edit posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all posts"
  ON posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admin can update their posts"
  ON posts FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin'));
