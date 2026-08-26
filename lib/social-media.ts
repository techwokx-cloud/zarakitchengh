// Social Media Integration
// Supports: Facebook, Instagram, TikTok, Twitter/X, WhatsApp

interface SocialPost {
  content: string;
  imageUrl?: string;
  videoUrl?: string;
  hashtags?: string[];
  platform: "facebook" | "instagram" | "tiktok" | "twitter" | "whatsapp";
}

// ============================================
// 1. FACEBOOK INTEGRATION
// ============================================

export async function postToFacebook(
  post: SocialPost,
  pageAccessToken: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const pageId = process.env.FACEBOOK_PAGE_ID;

    const formData = new FormData();
    formData.append("message", post.content);

    if (post.imageUrl) {
      formData.append("url", post.imageUrl);
    }

    if (post.videoUrl) {
      formData.append("video_url", post.videoUrl);
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${pageAccessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { id: string };
    return { success: true, postId: data.id };
  } catch (error) {
    console.error("Facebook posting failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// 2. INSTAGRAM INTEGRATION
// ============================================

export async function postToInstagram(
  post: SocialPost,
  igAccessToken: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  try {
    const igBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    // Create media container
    const containerResponse = await fetch(
      `https://graph.instagram.com/v18.0/${igBusinessAccountId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${igAccessToken}`,
        },
        body: JSON.stringify({
          image_url: post.imageUrl,
          caption: `${post.content}\n\n${post.hashtags?.join(" ") || ""}`,
          user_tags: [],
        }),
      }
    );

    if (!containerResponse.ok) {
      throw new Error(`Instagram container error: ${containerResponse.statusText}`);
    }

    const containerData = (await containerResponse.json()) as { id: string };

    // Publish the media
    const publishResponse = await fetch(
      `https://graph.instagram.com/v18.0/${igBusinessAccountId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${igAccessToken}`,
        },
        body: JSON.stringify({
          creation_id: containerData.id,
        }),
      }
    );

    if (!publishResponse.ok) {
      throw new Error(`Instagram publish error: ${publishResponse.statusText}`);
    }

    const publishData = (await publishResponse.json()) as { id: string };
    return { success: true, postId: publishData.id };
  } catch (error) {
    console.error("Instagram posting failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// 3. TIKTOK INTEGRATION (via TikTok Open API)
// ============================================

export async function postToTikTok(
  post: SocialPost,
  accessToken: string
): Promise<{ success: boolean; videoId?: string; error?: string }> {
  try {
    if (!post.videoUrl) {
      throw new Error("TikTok requires video URL");
    }

    const response = await fetch(
      "https://open-api.tiktok.com/share/video/upload/",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video_url: post.videoUrl,
          caption: `${post.content}\n${post.hashtags?.join(" ") || ""}`,
          privacy_level: "PUBLIC_TO_EVERYONE",
          disable_comment: false,
          disable_duet: false,
          disable_stitch: false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`TikTok API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { data: { video_id: string } };
    return { success: true, videoId: data.data.video_id };
  } catch (error) {
    console.error("TikTok posting failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// 4. TWITTER/X INTEGRATION
// ============================================

export async function postToTwitter(
  post: SocialPost,
  bearerToken: string
): Promise<{ success: boolean; tweetId?: string; error?: string }> {
  try {
    const tweetContent = `${post.content}\n\n${post.hashtags?.join(" ") || ""}`.substring(
      0,
      280
    );

    const payload: {
      text: string;
      media?: { media_ids: string[] };
    } = {
      text: tweetContent,
    };

    // If there's an image, upload it first
    if (post.imageUrl) {
      const mediaId = await uploadTwitterMedia(post.imageUrl, bearerToken);
      if (mediaId) {
        payload.media = { media_ids: [mediaId] };
      }
    }

    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.statusText}`);
    }

    const data = (await response.json()) as { data: { id: string } };
    return { success: true, tweetId: data.data.id };
  } catch (error) {
    console.error("Twitter posting failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function uploadTwitterMedia(
  imageUrl: string,
  bearerToken: string
): Promise<string | null> {
  try {
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();

    const formData = new FormData();
    formData.append("media_data", Buffer.from(imageBuffer).toString("base64"));

    const response = await fetch(
      "https://upload.twitter.com/1.1/media/upload.json",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        body: formData,
      }
    );

    const data = (await response.json()) as { media_id_string: string };
    return data.media_id_string;
  } catch (error) {
    console.error("Twitter media upload failed:", error);
    return null;
  }
}

// ============================================
// 5. WHATSAPP INTEGRATION (MultiWA + Meta Business)
// ============================================

export async function sendWhatsAppMarketing(
  message: string,
  imageUrl?: string,
  recipientPhoneNumber?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Use WhatsApp Business API
    const whatsappAccessToken = process.env.WHATSAPP_BUSINESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    const payload: {
      messaging_product: string;
      to: string;
      type: string;
      text?: { body: string };
      image?: { link: string };
    } = {
      messaging_product: "whatsapp",
      to: recipientPhoneNumber || process.env.ZARA_KITCHEN_WHATSAPP!,
      type: imageUrl ? "image" : "text",
    };

    if (imageUrl) {
      payload.image = { link: imageUrl };
    } else {
      payload.text = { body: message };
    }

    const response = await fetch(
      `https://graph.instagram.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${whatsappAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      messages: { id: string }[];
    };
    return { success: true, messageId: data.messages[0]?.id };
  } catch (error) {
    console.error("WhatsApp posting failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================
// 6. BATCH POSTING (Post to All Platforms)
// ============================================

export async function postToAllPlatforms(
  post: SocialPost,
  tokens: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    whatsapp?: string;
  }
): Promise<{
  results: Record<
    string,
    { success: boolean; id?: string; error?: string }
  >;
  overallSuccess: boolean;
}> {
  const results: Record<string, { success: boolean; id?: string; error?: string }> = {};

  // Post to each platform
  if (tokens.facebook) {
    results.facebook = await postToFacebook(post, tokens.facebook);
  }

  if (tokens.instagram) {
    results.instagram = await postToInstagram(post, tokens.instagram);
  }

  if (tokens.tiktok && post.videoUrl) {
    results.tiktok = await postToTikTok(post, tokens.tiktok);
  }

  if (tokens.twitter) {
    results.twitter = await postToTwitter(post, tokens.twitter);
  }

  if (tokens.whatsapp) {
    results.whatsapp = await sendWhatsAppMarketing(
      post.content,
      post.imageUrl
    );
  }

  const overallSuccess = Object.values(results).some((r) => r.success);

  return { results, overallSuccess };
}

// ============================================
// 7. SOCIAL MEDIA ACCOUNT MANAGEMENT
// ============================================

export async function getSocialAccounts(userId: string) {
  // This would query Supabase for the user's connected accounts
  // Implementation depends on Supabase setup
  return {
    facebook: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
    instagram: process.env.INSTAGRAM_ACCESS_TOKEN,
    tiktok: process.env.TIKTOK_ACCESS_TOKEN,
    twitter: process.env.TWITTER_BEARER_TOKEN,
    whatsapp: process.env.WHATSAPP_BUSINESS_TOKEN,
  };
}

export default {
  postToFacebook,
  postToInstagram,
  postToTikTok,
  postToTwitter,
  sendWhatsAppMarketing,
  postToAllPlatforms,
  getSocialAccounts,
};
