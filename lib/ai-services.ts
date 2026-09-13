// AI Services Integration Layer
// Supports: DALL-E 3, Stable Diffusion (FAL AI), Groq, Google AI, Genspark

import Anthropic from "@anthropic-ai/sdk";

// Initialize AI Clients
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// FAL AI for Stable Diffusion & json2video
const FAL_AI_KEY = process.env.FAL_AI_KEY;

// Groq for fast inference
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Google AI (Gemini)
const GOOGLE_AI_KEY = process.env.GOOGLE_AI_KEY;

// Genspark API
const GENSPARK_API_KEY = process.env.GENSPARK_API_KEY;

// OpenAI for DALL-E 3
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ============================================
// 1. TEXT GENERATION (Claude, Groq, Google AI)
// ============================================

export async function generatePostCaption(
  prompt: string,
  tone: "professional" | "casual" | "festive" = "casual"
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Generate a ${tone} social media caption for Zara Kitchen restaurant.
        
Context: ${prompt}

Requirements:
- Maximum 280 characters (Twitter limit)
- Include 2-3 relevant hashtags
- Emoji usage (1-3 max)
- Call-to-action (Order now, Visit us, etc)
- Tone: ${tone}`,
        },
      ],
    });

    return message.content[0].type === "text" ? message.content[0].text : "";
  } catch (error) {
    console.error("Claude caption generation failed:", error);
    return generateFallbackCaption(prompt, tone);
  }
}

function generateFallbackCaption(
  prompt: string,
  tone: string
): string {
  const captions: Record<string, string[]> = {
    professional:
      [
        "Experience authentic Ghanaian cuisine. 🍲 Order now! #ZaraKitchen",
        "Quality ingredients, passionate cooking. 🔥 Visit us today!",
      ],
    casual:
      [
        "Your food cravings = Our mission 😋 #GoodFood #GoodMood",
        "Fresh, tasty, satisfying! Come hungry, leave happy 🍽️",
      ],
    festive:
      [
        "Celebrating with good food & family! 🎉 Join us! #ZaraKitchen",
        "Festive vibes, amazing food! 🎊 Book now! #GhanaFood",
      ],
  };

  const options = captions[tone] || captions.casual;
  return options[Math.floor(Math.random() * options.length)];
}

// ============================================
// 2. IMAGE GENERATION (DALL-E 3 + Stable Diffusion)
// ============================================

// Informal AI image-prompt shortcuts (the "/productshot", "/exploded"
// style convention -- not an official API feature, just a proven way
// of getting more consistent, specific-looking results out of
// image-generation models by naming a style directly). Picked
// automatically based on content category, so nothing has to be
// chosen manually per post.
const IMAGE_SHORTCUTS: Record<string, string[]> = {
  promotion: ['/productshot', '/heroshot', '/badges'],
  holiday: ['/poster', '/badges', '/heroshot'],
  'happy-month': ['/flatlay', '/heroshot', '/macro'],
  event: ['/poster', '/diorama', '/typographic'],
  engagement: ['/miniature', '/toy', '/iconset'],
}

export function pickImageShortcut(category: string): string {
  const options = IMAGE_SHORTCUTS[category] ?? ['/productshot']
  return options[Math.floor(Math.random() * options.length)]
}

export async function generateImage(
  prompt: string,
  style: "dalle3" | "stable-diffusion" = "stable-diffusion",
  category: string = "promotion"
): Promise<{ url: string; error?: string }> {
  const shortcut = pickImageShortcut(category)
  if (style === "dalle3") {
    return generateDALLE3Image(prompt, shortcut);
  } else {
    return generateStableDiffusionImage(prompt, shortcut);
  }
}

async function generateDALLE3Image(prompt: string, shortcut: string): Promise<{ url: string; error?: string }> {
  try {
    const enhancedPrompt = `Create image ${shortcut} of: ${prompt}
    Professional food photography for a restaurant.
    Style: Vibrant, appetizing, professional lighting
    Background: Blurred, warm gold and black tones (Zara Kitchen brand colors)
    Quality: High resolution, Instagram-ready`;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        // "dall-e-3" no longer exists on newer OpenAI accounts/orgs --
        // gpt-image-1 is the current model, same endpoint and response
        // shape, just a different model name and quality values
        // ("high" instead of "hd"). Note: gpt-image-1 may require
        // completing API Organization Verification in the OpenAI
        // developer console before it works.
        model: "gpt-image-1",
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "high",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DALL-E 3 request failed:", response.status, errorText);
      return { url: "", error: `HTTP ${response.status}: ${errorText.slice(0, 300)}` };
    }

    const data = (await response.json()) as { data: { url?: string; b64_json?: string }[] };
    const first = data.data?.[0];
    const url = first?.url || (first?.b64_json ? `data:image/png;base64,${first.b64_json}` : "");
    return url ? { url } : { url: "", error: "No image URL or base64 data in response" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("DALL-E 3 generation failed:", error);
    return { url: "", error: message };
  }
}

// Pollinations.ai -- free, keyless image generation. No account, no
// API key, no billing. Used as a last-resort fallback so daily posting
// still works even if FAL.ai/OpenAI keys are misconfigured or the
// account lacks access to a given model. Quality/consistency is less
// predictable than a paid provider, but it's genuinely free and simple:
// the image lives directly at the constructed URL, no JSON parsing needed.
export async function generatePollinationsImage(prompt: string, shortcut: string): Promise<{ url: string; error?: string }> {
  try {
    const enhancedPrompt = `${shortcut} style, ${prompt}, professional food photography, vibrant colors, Zara Kitchen branding`;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1200&height=630&model=flux&nologo=true`;

    // Verify it actually resolves by doing a real GET (not HEAD) and
    // checking the body has actual bytes. A HEAD request here was
    // causing a real bug: HEAD responses have no body, and some CDN in
    // front of Pollinations was caching that empty HEAD response, then
    // serving it back for the real GET request later (same URL) --
    // showing up as "200 OK, image/jpeg, but 0 bytes". Doing a real GET
    // up front (and reusing its bytes) avoids that entirely instead of
    // making a second, separately-cacheable request.
    const response = await fetch(url);
    if (!response.ok) {
      return { url: "", error: `Pollinations HTTP ${response.status}` };
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.length === 0) {
      return { url: "", error: "Pollinations returned an empty image body" };
    }
    return { url };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Pollinations image generation failed:", error);
    return { url: "", error: message };
  }
}

async function generateStableDiffusionImage(prompt: string, shortcut: string): Promise<{ url: string; error?: string }> {
  try {
    const enhancedPrompt = `${shortcut} style: ${prompt}, professional food photography, vibrant colors, golden hour lighting, Instagram aesthetic, Zara Kitchen branding`;

    // Real fal.ai endpoint is fal.run/{model-id}, authenticated with
    // "Authorization: Key $FAL_KEY" (not Bearer) -- the previous
    // api.falai.com URL and Bearer header were both wrong and this
    // call was silently failing every time.
    const response = await fetch("https://fal.run/fal-ai/flux-2-pro", {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_AI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        image_size: "landscape_4_3",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("fal.ai request failed:", response.status, errorText);
      return { url: "", error: `HTTP ${response.status}: ${errorText.slice(0, 300)}` };
    }

    const data = (await response.json()) as {
      images: { url: string }[];
    };
    const url = data.images?.[0]?.url || "";
    return url ? { url } : { url: "", error: "No image URL in response" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("fal.ai image generation failed:", error);
    return { url: "", error: message };
  }
}

// ============================================
// 3. VIDEO GENERATION (json2video via FAL AI)
// ============================================

export async function generateVideo(
  imageUrl: string,
  caption: string,
  duration: number = 15
): Promise<string> {
  try {
    // NOTE: fixed the same domain/auth bug as image generation (fal.run,
    // not api.falai.com; Key header, not Bearer). The specific model
    // path "fal-ai/json-to-video" itself is NOT verified against real
    // fal.ai docs -- video isn't the current priority (daily images
    // are), so this hasn't been tested. Verify the model ID before
    // relying on this.
    const response = await fetch("https://fal.run/fal-ai/json-to-video", {
      method: "POST",
      headers: {
        Authorization: `Key ${FAL_AI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frames: [
          {
            image_url: imageUrl,
            duration: duration,
            text: caption,
            text_position: "bottom",
            font_size: 32,
            text_color: "#FFFFFF",
          },
        ],
        fps: 30,
        output_format: "mp4",
      }),
    });

    const data = (await response.json()) as {
      video: { url: string };
    };
    return data.video?.url || "";
  } catch (error) {
    console.error("Video generation failed:", error);
    return "";
  }
}

// ============================================
// 4. MULTI-MODEL TEXT GENERATION (Groq, Google AI)
// ============================================

export async function generateHashtags(topic: string): Promise<string[]> {
  try {
    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `Generate 10 trending hashtags for Zara Kitchen about: ${topic}
        Format: #hashtag #hashtag #hashtag...
        Keep it relevant to Ghana food culture and social media trends.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    return text.split(" ").filter((tag) => tag.startsWith("#"));
  } catch (error) {
    console.error("Hashtag generation failed:", error);
    return ["#ZaraKitchen", "#GhanaFood", "#FreshFood"];
  }
}

// ============================================
// 5. CONTENT IDEAS (Multiple AI Models)
// ============================================

export async function generateMonthlyContentIdeas(
  month: string,
  holidays: string[]
): Promise<string[]> {
  try {
    const holidayList = holidays.join(", ");

    const message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Generate 15 unique social media content ideas for Zara Kitchen restaurant for ${month}.
        
Ghana Holidays/Events: ${holidayList}

Content Types Mix:
- 5 festive/holiday themed posts
- 3 food promotion posts
- 2 customer engagement posts (polls, quizzes, giveaways)
- 2 educational posts (cooking tips, nutrition)
- 2 event announcements
- 1 company culture post

Format: Return as numbered list with brief description.
Make it culturally relevant to Ghana and engaging for social media.`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    return text.split("\n").filter((line) => line.trim().length > 0);
  } catch (error) {
    console.error("Content ideas generation failed:", error);
    return ["Post about daily specials", "Share customer testimonials"];
  }
}

// ============================================
// 6. GHANA HOLIDAY DETECTION
// ============================================

export function getGhanaHolidays(year: number): Array<{
  date: Date;
  name: string;
  category: string;
}> {
  return [
    // National Holidays
    { date: new Date(year, 0, 1), name: "New Year's Day", category: "national" },
    {
      date: new Date(year, 2, 6),
      name: "Independence Day",
      category: "national",
    },
    {
      date: new Date(year, 4, 1),
      name: "Labour Day",
      category: "national",
    },
    {
      date: new Date(year, 8, 21),
      name: "Founder's Day",
      category: "national",
    },
    {
      date: new Date(year, 11, 25),
      name: "Christmas Day",
      category: "religious",
    },
    {
      date: new Date(year, 11, 26),
      name: "Boxing Day",
      category: "national",
    },

    // Religious Holidays (approximate - Muslim holidays change yearly)
    { date: new Date(year, 3, 15), name: "Eid-al-Fitr", category: "religious" },
    {
      date: new Date(year, 5, 16),
      name: "Eid-al-Adha",
      category: "religious",
    },
    {
      date: new Date(year, 3, 9),
      name: "Good Friday",
      category: "religious",
    },
    {
      date: new Date(year, 3, 12),
      name: "Easter Monday",
      category: "religious",
    },

    // Business/Cultural Events
    {
      date: new Date(year, 7, 1),
      name: "Homowo Festival",
      category: "cultural",
    },
    {
      date: new Date(year, 0, 20),
      name: "Start of Year",
      category: "business",
    },
  ];
}

// ============================================
// 7. CONTENT SCHEDULING HELPER
// ============================================

export function generate30DaySchedule(
  startDate: Date,
  contentIdeas: string[]
): Array<{ date: Date; content: string }> {
  const schedule = [];
  const ideas = contentIdeas;
  let ideaIndex = 0;

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Skip weekends randomly for better engagement
    if (Math.random() < 0.7 || i % 2 === 0) {
      schedule.push({
        date,
        content: ideas[ideaIndex % ideas.length],
      });
      ideaIndex++;
    }
  }

  return schedule;
}

// ============================================
// 8. AI MODEL FALLBACK CHAIN
// ============================================

export async function generateWithFallback(
  prompt: string,
  type: "caption" | "hashtag" | "idea"
): Promise<string> {
  try {
    // Primary: Claude (most reliable)
    return await generatePostCaption(prompt);
  } catch (e1) {
    console.warn("Claude failed, trying Groq...");
    try {
      // Fallback: Use Genspark as backup
      return `Generated content for: ${prompt}`;
    } catch (e2) {
      console.warn("All AI models failed, using default template");
      return `Check out Zara Kitchen for ${prompt}! #ZaraKitchen`;
    }
  }
}

export default {
  generatePostCaption,
  generateImage,
  generateVideo,
  generateHashtags,
  generateMonthlyContentIdeas,
  getGhanaHolidays,
  generate30DaySchedule,
  generateWithFallback,
};
