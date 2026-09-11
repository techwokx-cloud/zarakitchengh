// app/manager/menu/page.tsx
export default function MenuPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-2">Menu</h1>
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center mt-6">
        <p className="text-gray-400 max-w-md mx-auto">
          Manage menu items, prices, and availability here. For now, menu content is managed directly in the codebase (lib/menuData.ts) -- this page will replace that with a real editable interface.
        </p>
      </div>
    </div>
  )
}
