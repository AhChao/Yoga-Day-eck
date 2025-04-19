import { useState } from 'react'
import { Bars3Icon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [asanas, setAsanas] = useState([])

  const addAsana = () => {
    const newAsana = {
      id: Date.now(),
      name: 'New Asana',
      description: 'Click to edit description'
    }
    setAsanas([...asanas, newAsana])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Yoga Deck</h2>
          <nav>
            {asanas.map(asana => (
              <div key={asana.id} className="mb-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer">
                {asana.name}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {asanas.map(asana => (
              <div key={asana.id} className="yoga-card">
                <h3 className="text-lg font-semibold mb-2">{asana.name}</h3>
                <p className="text-gray-600">{asana.description}</p>
              </div>
            ))}
            
            {/* Add new asana card */}
            <button
              onClick={addAsana}
              className="add-card h-[200px]"
            >
              <PlusIcon className="h-12 w-12 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
