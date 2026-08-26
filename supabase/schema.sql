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

-- 11. Menu Items (Dynamic Menu Management)
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL, -- Breakfast, Appetizers, Salads, Mains, etc
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL, -- In GHS
  currency VARCHAR(10) DEFAULT 'GHS',
  image_url VARCHAR(500),
  image_alt_text VARCHAR(255),
  is_available BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_spicy BOOLEAN DEFAULT FALSE,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Menu Categories
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  emoji VARCHAR(10),
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Catering Packages
CREATE TABLE catering_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL, -- e.g., "Corporate Lunch Bundle", "Executive Dinner"
  description TEXT,
  package_type VARCHAR(50), -- corporate, wedding, birthday, conference, custom
  min_guests INT DEFAULT 10,
  max_guests INT DEFAULT 500,
  price_per_head DECIMAL(10,2) NOT NULL, -- In GHS
  includes TEXT, -- JSON array of what's included
  menu_items TEXT, -- JSON array of item IDs
  setup_fee DECIMAL(10,2) DEFAULT 0,
  service_charge_percentage DECIMAL(5,2) DEFAULT 10, -- 10% service charge
  image_url VARCHAR(500),
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Event Bookings/Catering Requests
CREATE TABLE event_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference VARCHAR(50) UNIQUE,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  event_date DATE NOT NULL,
  event_time TIME,
  event_location VARCHAR(255),
  event_type VARCHAR(50), -- corporate, wedding, birthday, conference, etc
  number_of_guests INT,
  catering_package_id UUID REFERENCES catering_packages(id),
  special_requests TEXT,
  budget DECIMAL(10,2),
  estimated_cost DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, catering-assigned, completed, cancelled
  payment_status VARCHAR(50) DEFAULT 'unpaid', -- unpaid, partial, paid
  assigned_to UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Gallery Images
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50), -- food, ambiance, events, kitchen, team
  title VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  image_alt_text VARCHAR(255),
  description TEXT,
  menu_item_id UUID REFERENCES menu_items(id), -- If it's a food image
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_menu_items_category ON menu_items(category);
CREATE INDEX idx_menu_items_is_available ON menu_items(is_available);
CREATE INDEX idx_catering_packages_type ON catering_packages(package_type);
CREATE INDEX idx_event_bookings_status ON event_bookings(status);
CREATE INDEX idx_event_bookings_date ON event_bookings(event_date);
CREATE INDEX idx_gallery_images_category ON gallery_images(category);

-- Policies (Row Level Security)
-- Only admin can see/edit posts

CREATE POLICY "Admin can view all posts"
  ON posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admin can update their posts"
  ON posts FOR UPDATE
  USING (auth.uid() = created_by OR auth.uid() IN (SELECT id FROM admin_users WHERE role = 'admin'));
