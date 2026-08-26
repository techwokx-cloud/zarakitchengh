import { NextRequest, NextResponse } from 'next/server'

// Mock database - replace with actual Supabase calls
const menuItems = [
  {
    id: '1',
    category: 'Appetizers',
    name: 'Steamed Mussels with glass noodles & garlic sauce',
    description: 'Fresh mussels steamed with glass noodles in garlic sauce',
    price: 98.00,
    image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
    is_available: true,
    is_spicy: false,
    is_vegetarian: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const id = searchParams.get('id')

    if (id) {
      // Get single item
      const item = menuItems.find(m => m.id === id)
      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }
      return NextResponse.json(item)
    }

    if (category) {
      // Get items by category
      const items = menuItems.filter(m => m.category === category)
      return NextResponse.json(items)
    }

    // Get all items
    return NextResponse.json(menuItems)
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.category || !body.price) {
      return NextResponse.json(
        { error: 'Missing required fields: name, category, price' },
        { status: 400 }
      )
    }

    // TODO: Add auth check and Supabase insert
    const newItem = {
      id: Math.random().toString(36).substring(7),
      ...body,
      created_at: new Date().toISOString(),
    }

    menuItems.push(newItem)
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error('Error creating menu item:', error)
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const id = body.id

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const itemIndex = menuItems.findIndex(m => m.id === id)
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // TODO: Add auth check and Supabase update
    const updatedItem = {
      ...menuItems[itemIndex],
      ...body,
      updated_at: new Date().toISOString(),
    }

    menuItems[itemIndex] = updatedItem
    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating menu item:', error)
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const itemIndex = menuItems.findIndex(m => m.id === id)
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    // TODO: Add auth check and Supabase delete
    menuItems.splice(itemIndex, 1)
    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 })
  }
}
