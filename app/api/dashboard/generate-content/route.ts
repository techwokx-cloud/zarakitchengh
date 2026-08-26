// app/api/dashboard/generate-content/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  generatePostCaption,
  generateImage,
  generateVideo,
  generateHashtags,
} from "@/lib/ai-services";
import { postToAllPlatforms } from "@/lib/social-media";

// Create Supabase client at runtime, not build time
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    const body = await request.json();
    const {
      type, // "text", "image", "video", "carousel"
      prompt,
      contentType, // "holiday", "promotion", "event", "engagement"
      imageStyle, // "dalle3" or "stable-diffusion"
      scheduledDate,
      platformTargets, // ["facebook", "instagram", "tiktok", "twitter"]
      autoPost = false, // Auto-post or just save as draft
    } = body;

    // Verify user is authenticated
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Generate content based on type
    let generatedContent: {
      caption?: string;
      imageUrl?: string;
      videoUrl?: string;
      hashtags?: string[];
    } = {};

    // 1. Generate Caption
    if (["text", "image", "video", "carousel"].includes(type)) {
      const caption = await generatePostCaption(prompt);
      generatedContent.caption = caption;

      // Get hashtags
      const hashtags = await generateHashtags(contentType);
      generatedContent.hashtags = hashtags;
    }

    // 2. Generate Image
    if (["image", "video", "carousel"].includes(type)) {
      const imageUrl = await generateImage(prompt, imageStyle);
      generatedContent.imageUrl = imageUrl;
    }

    // 3. Generate Video
    if (["video", "carousel"].includes(type)) {
      if (generatedContent.imageUrl) {
        const videoUrl = await generateVideo(
          generatedContent.imageUrl,
          generatedContent.caption || "",
          15
        );
        generatedContent.videoUrl = videoUrl;
      }
    }

    // 4. Save to Database
    const { data: post, error: dbError } = await supabase
      .from("posts")
      .insert([
        {
          title: `${contentType} - ${new Date().toLocaleDateString()}`,
          content: generatedContent.caption,
          image_url: generatedContent.imageUrl,
          video_url: generatedContent.videoUrl,
          post_type: type,
          status: autoPost ? "scheduled" : "draft",
          created_by: userId,
          scheduled_date: scheduledDate || new Date(),
          ai_model: imageStyle === "dalle3" ? "dalle3" : "stable-diffusion",
        },
      ])
      .select();

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 400 }
      );
    }

    // 5. Auto-Post if requested
    if (autoPost && post && post.length > 0) {
      const socialTokens = {
        facebook: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
        instagram: process.env.INSTAGRAM_ACCESS_TOKEN,
        tiktok: process.env.TIKTOK_ACCESS_TOKEN,
        twitter: process.env.TWITTER_BEARER_TOKEN,
      };

      const postResult = await postToAllPlatforms(
        {
          content: generatedContent.caption || "",
          imageUrl: generatedContent.imageUrl,
          videoUrl: generatedContent.videoUrl,
          hashtags: generatedContent.hashtags,
          platform: "facebook",
        },
        socialTokens
      );

      // Update post status with social media IDs
      if (postResult.overallSuccess) {
        await supabase
          .from("posts")
          .update({
            status: "published",
            facebook_post_id: postResult.results.facebook?.id,
            instagram_post_id: postResult.results.instagram?.id,
            tiktok_post_id: postResult.results.tiktok?.id,
            twitter_post_id: postResult.results.twitter?.id,
            published_date: new Date(),
          })
          .eq("id", post[0].id);
      }

      return NextResponse.json({
        success: true,
        post: post[0],
        socialMediaResults: postResult,
      });
    }

    return NextResponse.json({
      success: true,
      post: post?.[0],
      message: "Content generated and saved",
    });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Generation failed",
      },
      { status: 500 }
    );
  }
}

// GET - Fetch generated posts
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const status = request.nextUrl.searchParams.get("status") || "draft";
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20");

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, posts: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fetch failed" },
      { status: 500 }
    );
  }
}
