'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, Filter } from 'lucide-react'

// Mock data - will be replaced with API calls
const MENU_CATEGORIES = [
  { id: 1, name: 'All Categories', emoji: '📋' },
  { id: 2, name: 'Healthy Breakfast', emoji: '🥗' },
  { id: 3, name: 'Hot Breakfast', emoji: '🍳' },
  { id: 4, name: 'On the Bakery', emoji: '🥐' },
  { id: 5, name: 'Appetisers', emoji: '🍤' },
  { id: 6, name: 'Salads', emoji: '🥬' },
  { id: 7, name: 'Light Meals', emoji: '🍴' },
  { id: 8, name: 'On the Grill', emoji: '🔥' },
  { id: 9, name: 'Pastas', emoji: '🍝' },
  { id: 10, name: 'Chinese Food', emoji: '🥢' },
  { id: 11, name: 'Indian Dishes', emoji: '🍛' },
  { id: 12, name: 'Rice Dishes', emoji: '🍚' },
  { id: 13, name: 'Ghanaian Specialities', emoji: '🇬🇭' },
  { id: 14, name: 'From the Grill', emoji: '🐟' },
  { id: 15, name: 'Soups', emoji: '🍲' },
  { id: 16, name: 'Extra Dishes', emoji: '🍟' },
  { id: 17, name: 'Desserts', emoji: '🍰' },
]

const SAMPLE_MENU_ITEMS = [
  {
    id: 1,
    category: 'Appetisers',
    name: 'Chicken Wings',
    price: 50.00,
    description: 'A tasty starter to open up the appetite.',
    image: '/images/menu/appetisers/chicken-wings.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 2,
    category: 'Appetisers',
    name: 'Spicy Chicken Wings',
    price: 30.00,
    description: 'A tasty starter to open up the appetite.',
    image: '/images/menu/appetisers/chicken-wings1.jpg',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 3,
    category: 'Appetisers',
    name: 'Guinea Fowl',
    price: 40.00,
    description: 'A tasty starter to open up the appetite.',
    image: '/images/menu/appetisers/guinea-fowl.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 4,
    category: 'Appetisers',
    name: 'Kelewele',
    price: 35.00,
    description: 'A tasty starter to open up the appetite.',
    image: '/images/menu/appetisers/kelewele.jpg',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 5,
    category: 'Appetisers',
    name: 'Fried Calamari',
    price: 50.00,
    description: 'A tasty starter to open up the appetite.',
    image: '/images/menu/appetisers/fried-calamari.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 6,
    category: 'Appetisers',
    name: 'prawns',
    price: 50.00,
    description: 'A tasty starter to open up the appetite.',
    image: '/images/menu/appetisers/prawns.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 7,
    category: 'Chinese Food',
    name: 'Beef Chop',
    price: 90.00,
    description: 'Wok-fried favourites, Zara Kitchen style.',
    image: '/images/menu/chinese-food/beef-chop.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 8,
    category: 'Chinese Food',
    name: 'Chinese Beef',
    price: 60.00,
    description: 'Wok-fried favourites, Zara Kitchen style.',
    image: '/images/menu/chinese-food/chinese-beef.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 9,
    category: 'Chinese Food',
    name: 'Chinese Chicken',
    price: 70.00,
    description: 'Wok-fried favourites, Zara Kitchen style.',
    image: '/images/menu/chinese-food/chinese-chicken.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 10,
    category: 'Chinese Food',
    name: 'Chinese Pork in Sauce',
    price: 55.00,
    description: 'Wok-fried favourites, Zara Kitchen style.',
    image: '/images/menu/chinese-food/chinese-pork-sauce.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 11,
    category: 'Chinese Food',
    name: 'Fish Chili Sauce',
    price: 65.00,
    description: 'Wok-fried favourites, Zara Kitchen style.',
    image: '/images/menu/chinese-food/fish-chili-sauce.jpg',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 12,
    category: 'Chinese Food',
    name: 'Peking Chicken Sauce',
    price: 75.00,
    description: 'Wok-fried favourites, Zara Kitchen style.',
    image: '/images/menu/chinese-food/perking-chicken-sauce.jpg',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 13,
    category: 'Chinese Food',
    name: 'Sweet & Sour Fish',
    price: 55.00,
    description: 'Wok-fried favourites, Zara Kitchen style.',
    image: '/images/menu/chinese-food/sweet-sour-fish.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 14,
    category: 'Desserts',
    name: 'Chocolate Pudding',
    price: 25.00,
    description: 'A sweet way to end your meal.',
    image: '/images/menu/desserts/chocolate-pudding.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 15,
    category: 'Desserts',
    name: 'Fruit Salad',
    price: 35.00,
    description: 'A sweet way to end your meal.',
    image: '/images/menu/desserts/fruit-salad.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 16,
    category: 'Desserts',
    name: 'Assorted Cakes & Desserts',
    price: 30.00,
    description: 'A sweet way to end your meal.',
    image: '/images/menu/desserts/cakes-and-dessert.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 17,
    category: 'Desserts',
    name: 'Ice Cream',
    price: 25.00,
    description: 'A sweet way to end your meal.',
    image: '/images/menu/desserts/ice-cream.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 18,
    category: 'Extra Dishes',
    name: 'Jollof Rice',
    price: 50.00,
    description: 'A Zara Kitchen favourite, made to order.',
    image: '/images/menu/extra-dishes/jollof-rice.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 19,
    category: 'From the Grill',
    name: 'Grilled Cassava Fish',
    price: 100.00,
    description: 'Fresh off the grill, smoky and flavourful.',
    image: '/images/menu/from-the-grill/grilled-cassava-fish.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 20,
    category: 'From the Grill',
    name: 'Grilled Chicken',
    price: 60.00,
    description: 'Fresh off the grill, smoky and flavourful.',
    image: '/images/menu/from-the-grill/grilled-chicken.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 21,
    category: 'From the Grill',
    name: 'Grilled Guinea Fowl',
    price: 100.00,
    description: 'Fresh off the grill, smoky and flavourful.',
    image: '/images/menu/from-the-grill/grilled-guinea-fowl.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 22,
    category: 'From the Grill',
    name: 'Grilled Snapper',
    price: 95.00,
    description: 'Fresh off the grill, smoky and flavourful.',
    image: '/images/menu/from-the-grill/grilled-snapper.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 23,
    category: 'From the Grill',
    name: 'Charcoal Grilled Tilapia',
    price: 75.00,
    description: 'Fresh off the grill, smoky and flavourful.',
    image: '/images/menu/from-the-grill/charcoal-tilapia.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 24,
    category: 'Ghanaian Specialities',
    name: 'Ayoyo Kontomire Stew',
    price: 50.00,
    description: 'An authentic Ghanaian classic, made with love.',
    image: '/images/menu/ghanaian-specialities/asakna-kotomire.jpg',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 25,
    category: 'Ghanaian Specialities',
    name: 'Fully Loaded Waakye',
    price: 90.00,
    description: 'An authentic Ghanaian classic, made with love.',
    image: '/images/menu/ghanaian-specialities/fuly-loaded-waakye.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 26,
    category: 'Ghanaian Specialities',
    name: 'Grilled Cassava Fish',
    price: 60.00,
    description: 'An authentic Ghanaian classic, made with love.',
    image: '/images/menu/ghanaian-specialities/grilled-cassava-fish.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 27,
    category: 'Ghanaian Specialities',
    name: 'Grilled Chicken',
    price: 50.00,
    description: 'An authentic Ghanaian classic, made with love.',
    image: '/images/menu/ghanaian-specialities/grilled-chicken.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 28,
    category: 'Ghanaian Specialities',
    name: 'Grilled Guinea Fowl',
    price: 50.00,
    description: 'An authentic Ghanaian classic, made with love.',
    image: '/images/menu/ghanaian-specialities/grilled-guinea-fowl.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 29,
    category: 'Ghanaian Specialities',
    name: 'Grilled Snapper',
    price: 85.00,
    description: 'An authentic Ghanaian classic, made with love.',
    image: '/images/menu/ghanaian-specialities/grilled-snapper.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 30,
    category: 'Ghanaian Specialities',
    name: 'Palava Sauce with Ampesi',
    price: 70.00,
    description: 'An authentic Ghanaian classic, made with love.',
    image: '/images/menu/ghanaian-specialities/palava-sauce-ampesi.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 31,
    category: 'Ghanaian Specialities',
    name: 'Charcoal Grilled Tilapia',
    price: 80.00,
    description: 'An authentic Ghanaian classic, made with love.',
    image: '/images/menu/ghanaian-specialities/charcoal-tilapia.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 32,
    category: 'Healthy Breakfast',
    name: 'Cereal Bowl',
    price: 35.00,
    description: 'A wholesome way to start the day, made fresh each morning.',
    image: '/images/menu/healthy-breakfast/cereak-bowl.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 33,
    category: 'Healthy Breakfast',
    name: 'Fruit Salad',
    price: 35.00,
    description: 'A wholesome way to start the day, made fresh each morning.',
    image: '/images/menu/healthy-breakfast/fruit-salad.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 34,
    category: 'Healthy Breakfast',
    name: 'Granola Bowl',
    price: 40.00,
    description: 'A wholesome way to start the day, made fresh each morning.',
    image: '/images/menu/healthy-breakfast/granola-bowl.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 35,
    category: 'Hot Breakfast',
    name: 'Avocado, Bacon & Egg',
    price: 45.00,
    description: 'A hearty hot breakfast plate, cooked to order.',
    image: '/images/menu/hot-breakfast/avocago-bacon-egg.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 36,
    category: 'Hot Breakfast',
    name: 'Bacon Benedict',
    price: 45.00,
    description: 'A hearty hot breakfast plate, cooked to order.',
    image: '/images/menu/hot-breakfast/bacon-benedict.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 37,
    category: 'Hot Breakfast',
    name: 'Omelette',
    price: 50.00,
    description: 'A hearty hot breakfast plate, cooked to order.',
    image: '/images/menu/hot-breakfast/omlette.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 38,
    category: 'Hot Breakfast',
    name: 'Zara Full Breakfast',
    price: 45.00,
    description: 'A hearty hot breakfast plate, cooked to order.',
    image: '/images/menu/hot-breakfast/zara-full-breakfast1.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 39,
    category: 'Indian Dishes',
    name: 'Chicken Biyani',
    price: 85.00,
    description: 'Rich, aromatic and full of spice.',
    image: '/images/menu/indian-dishes/chicken-biyani.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 40,
    category: 'Indian Dishes',
    name: 'Chicken Tikka',
    price: 75.00,
    description: 'Rich, aromatic and full of spice.',
    image: '/images/menu/indian-dishes/chicken-tikka.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 41,
    category: 'Indian Dishes',
    name: 'Spicy Chicken',
    price: 80.00,
    description: 'Rich, aromatic and full of spice.',
    image: '/images/menu/indian-dishes/spicy-chicken.jpg',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 42,
    category: 'Indian Dishes',
    name: 'Vegetable Korma',
    price: 55.00,
    description: 'Rich, aromatic and full of spice.',
    image: '/images/menu/indian-dishes/vegetable-korma.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 43,
    category: 'Light Meals',
    name: 'Bacon Avo',
    price: 35.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/bacon-avo.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 44,
    category: 'Light Meals',
    name: 'Beef Wrap',
    price: 35.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/beef-wrap.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 45,
    category: 'Light Meals',
    name: 'Boss Lady',
    price: 30.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/boss-lady.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 46,
    category: 'Light Meals',
    name: 'Chicken Burger',
    price: 35.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/chicken-burger.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 47,
    category: 'Light Meals',
    name: 'Chicken Wrap',
    price: 30.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/chicken-wrap.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 48,
    category: 'Light Meals',
    name: 'Corned Beef Sandwich',
    price: 35.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/coument-beef.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 49,
    category: 'Light Meals',
    name: 'Miss Tuna',
    price: 45.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/miss-tuna.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 50,
    category: 'Light Meals',
    name: 'Club Sandwich',
    price: 35.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/sandwitch.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 51,
    category: 'Light Meals',
    name: 'Zara Chic',
    price: 35.00,
    description: 'A quick, satisfying bite for any time of day.',
    image: '/images/menu/light-meals/zara-chic.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 52,
    category: 'On the Grill',
    name: 'BBQ Chicken',
    price: 85.00,
    description: 'Chargrilled to perfection over an open flame.',
    image: '/images/menu/on-the-grill/bbq-chicken.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 53,
    category: 'On the Grill',
    name: 'Beef Tenderloin',
    price: 85.00,
    description: 'Chargrilled to perfection over an open flame.',
    image: '/images/menu/on-the-grill/beef-tenderliom.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 54,
    category: 'On the Grill',
    name: 'Grilled Salmon',
    price: 125.00,
    description: 'Chargrilled to perfection over an open flame.',
    image: '/images/menu/on-the-grill/grilled-salmon.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 55,
    category: 'On the Grill',
    name: 'Lamb Chop',
    price: 110.00,
    description: 'Chargrilled to perfection over an open flame.',
    image: '/images/menu/on-the-grill/lamb-chop.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 56,
    category: 'On the Grill',
    name: 'Surf & Turf',
    price: 105.00,
    description: 'Chargrilled to perfection over an open flame.',
    image: '/images/menu/on-the-grill/surf-turf.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 57,
    category: 'On the Bakery',
    name: 'Assorted Muffins',
    price: 20.00,
    description: 'Freshly baked in-house, best enjoyed warm.',
    image: '/images/menu/on-the-bakery/assorted-muffins.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 58,
    category: 'On the Bakery',
    name: 'Croissant',
    price: 25.00,
    description: 'Freshly baked in-house, best enjoyed warm.',
    image: '/images/menu/on-the-bakery/croissant.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 59,
    category: 'On the Bakery',
    name: 'Pan Cake',
    price: 15.00,
    description: 'Freshly baked in-house, best enjoyed warm.',
    image: '/images/menu/on-the-bakery/pan-cake.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 60,
    category: 'On the Bakery',
    name: 'Scones',
    price: 20.00,
    description: 'Freshly baked in-house, best enjoyed warm.',
    image: '/images/menu/on-the-bakery/scones.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 61,
    category: 'On the Bakery',
    name: 'Waffles',
    price: 30.00,
    description: 'Freshly baked in-house, best enjoyed warm.',
    image: '/images/menu/on-the-bakery/waffles.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 62,
    category: 'Pastas',
    name: 'Fettuccine Polo',
    price: 70.00,
    description: 'Made fresh with our house sauces.',
    image: '/images/menu/pastas/fettucini-polo.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 63,
    category: 'Pastas',
    name: 'Grilled Creamy',
    price: 65.00,
    description: 'Made fresh with our house sauces.',
    image: '/images/menu/pastas/grilled-creamy.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 64,
    category: 'Pastas',
    name: 'Mac & Cheese',
    price: 70.00,
    description: 'Made fresh with our house sauces.',
    image: '/images/menu/pastas/mac-cheease.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 65,
    category: 'Pastas',
    name: 'Mushroom',
    price: 75.00,
    description: 'Made fresh with our house sauces.',
    image: '/images/menu/pastas/mushroom.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 66,
    category: 'Pastas',
    name: 'Penne Arrabbiata',
    price: 75.00,
    description: 'Made fresh with our house sauces.',
    image: '/images/menu/pastas/penne-arabtiana.jpg',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 67,
    category: 'Pastas',
    name: 'Seafood Pasta',
    price: 55.00,
    description: 'Made fresh with our house sauces.',
    image: '/images/menu/pastas/sea-food.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 68,
    category: 'Rice Dishes',
    name: 'Chicken Fried Rice',
    price: 40.00,
    description: 'A generous plate of perfectly seasoned rice.',
    image: '/images/menu/rice-dishes/chiken-fried-rice.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 69,
    category: 'Rice Dishes',
    name: 'Zara Special',
    price: 50.00,
    description: 'A generous plate of perfectly seasoned rice.',
    image: '/images/menu/rice-dishes/zara-special.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 70,
    category: 'Rice Dishes',
    name: 'beef rice',
    price: 50.00,
    description: 'A generous plate of perfectly seasoned rice.',
    image: '/images/menu/rice-dishes/beef-rice.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 71,
    category: 'Rice Dishes',
    name: 'egg fried rice',
    price: 45.00,
    description: 'A generous plate of perfectly seasoned rice.',
    image: '/images/menu/rice-dishes/egg-fried-rice.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 72,
    category: 'Rice Dishes',
    name: 'Ghana Jollof Special',
    price: 70.00,
    description: 'A generous plate of perfectly seasoned rice.',
    image: '/images/menu/rice-dishes/ghana.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 73,
    category: 'Salads',
    name: 'Asian Salad',
    price: 45.00,
    description: 'Crisp, fresh and made with seasonal vegetables.',
    image: '/images/menu/salads/asian-salad.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 74,
    category: 'Salads',
    name: 'Avocado Salad',
    price: 30.00,
    description: 'Crisp, fresh and made with seasonal vegetables.',
    image: '/images/menu/salads/avacado-salad.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 75,
    category: 'Salads',
    name: 'Caesar Salad',
    price: 40.00,
    description: 'Crisp, fresh and made with seasonal vegetables.',
    image: '/images/menu/salads/ceaser-salad.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 76,
    category: 'Salads',
    name: 'Green Salad',
    price: 35.00,
    description: 'Crisp, fresh and made with seasonal vegetables.',
    image: '/images/menu/salads/green-salad.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 77,
    category: 'Salads',
    name: 'Zara Salad',
    price: 45.00,
    description: 'Crisp, fresh and made with seasonal vegetables.',
    image: '/images/menu/salads/zara-salad.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 78,
    category: 'Soups',
    name: 'Ebunuebunu Soup with Fufu',
    price: 55.00,
    description: 'A warm, comforting bowl of traditional soup.',
    image: '/images/menu/soups/ebunubu-and-fufu.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 79,
    category: 'Soups',
    name: 'Egusi Soup with Eba',
    price: 50.00,
    description: 'A warm, comforting bowl of traditional soup.',
    image: '/images/menu/soups/egusi-and-eba.jpg',
    isSpicy: false,
    isVegetarian: true,
  },
  {
    id: 80,
    category: 'Soups',
    name: 'Fufu with Palm Nut Soup',
    price: 50.00,
    description: 'A warm, comforting bowl of traditional soup.',
    image: '/images/menu/soups/fufu-and-palm.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 81,
    category: 'Soups',
    name: 'Groundnut Soup with Rice Balls',
    price: 60.00,
    description: 'A warm, comforting bowl of traditional soup.',
    image: '/images/menu/soups/groundnut-and-riceball.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 82,
    category: 'Soups',
    name: 'Light Soup',
    price: 50.00,
    description: 'A warm, comforting bowl of traditional soup.',
    image: '/images/menu/soups/light-soap.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
  {
    id: 83,
    category: 'Soups',
    name: 'Okro Soup with Banku',
    price: 60.00,
    description: 'A warm, comforting bowl of traditional soup.',
    image: '/images/menu/soups/okro-and-banku.jpg',
    isSpicy: true,
    isVegetarian: false,
  },
  {
    id: 84,
    category: 'Soups',
    name: 'Red Red with Fried Plantain',
    price: 70.00,
    description: 'A warm, comforting bowl of traditional soup.',
    image: '/images/menu/soups/red-red.jpg',
    isSpicy: false,
    isVegetarian: false,
  },
]

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All Categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState(SAMPLE_MENU_ITEMS)

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    filterMenu(category, searchQuery)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterMenu(activeCategory, query)
  }

  const filterMenu = (category: string, search: string) => {
    let filtered = SAMPLE_MENU_ITEMS

    if (category !== 'All Categories') {
      filtered = filtered.filter(item => item.category === category)
    }

    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }

  return (
    <main className="min-h-screen bg-black">
      <Header />

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
        <div className="container-wide">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-white mb-2">Our Menu</h1>
          <p className="text-xl text-gray-300">Authentic Ghanaian & Continental Cuisine</p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8">
        {/* Sidebar - Categories */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Filter size={20} />
              Categories
            </h2>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-zara-gold"
                />
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              {MENU_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition ${
                    activeCategory === category.name
                      ? 'bg-zara-gold text-black font-bold'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{category.emoji}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Menu Items */}
        <div className="flex-1">
          {/* Active Category Display */}
          <div className="mb-8">
            <h2 className="font-display text-3xl font-semibold text-white mb-2">{activeCategory}</h2>
            <p className="text-gray-400">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
            </p>
          </div>

          {/* Menu Grid */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-zara-gold transition group"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition"></div>

                    {/* Tags */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {item.isSpicy && (
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
                          🌶️ Spicy
                        </span>
                      )}
                      {item.isVegetarian && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">
                          🥬 Vegan
                        </span>
                      )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 bg-zara-gold text-black px-4 py-2 rounded-lg font-bold text-lg">
                      GHS {item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>

                    {/* Add to Order Button */}
                    <button className="w-full bg-zara-gold text-black font-bold py-2 rounded-lg hover:bg-zara-orange transition">
                      Add to Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No items found matching your search.</p>
              <button
                onClick={() => {
                  setActiveCategory('All Categories')
                  setSearchQuery('')
                  filterMenu('All Categories', '')
                }}
                className="mt-4 text-zara-gold hover:text-zara-orange transition"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-zara-gold/10 to-zara-orange/10 border-t border-gray-800">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-semibold text-white mb-4">Ready to Order?</h2>
          <p className="text-gray-300 mb-6">Choose your favorite dishes and place your order now!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+233243637122" className="btn-primary text-lg px-8 py-4">
              🛒 Order Online
            </a>
            <a
              href="https://wa.me/233243637122"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-lg px-8 py-4"
            >
              💬 Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
