// lib/menuItemsApi.ts
// Client-side helpers for reading/writing menu items from Supabase.
// Replaces the old static SAMPLE_MENU_ITEMS array in lib/menuData.ts --
// that file's MENU_CATEGORIES list is still used (categories rarely
// change), but item data now lives in the database.

import { supabase } from '@/lib/supabase/client'

export interface MenuItem {
  id: string
  category: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  is_spicy: boolean
  is_vegetarian: boolean
  is_featured_hero: boolean
  display_order: number
}

// Public-facing fetch: only available items, ordered for display.
// Used by the /menu page, homepage category reveal, and gallery.
export async function fetchAvailableMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch menu items:', error.message)
    return []
  }
  return data ?? []
}

// Hero slideshow images: only items marked as featured, in order.
export async function fetchHeroMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_featured_hero', true)
    .eq('is_available', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch hero menu items:', error.message)
    return []
  }
  return data ?? []
}

// Staff-facing fetch: everything, including unavailable items.
// Used by the Restaurant Manager's Menu management page.
export async function fetchAllMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Failed to fetch menu items:', error.message)
    return []
  }
  return data ?? []
}
