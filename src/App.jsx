import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon, PlusIcon, PencilIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableAsanaCard({ asana, isEditing, onEdit, onUpdate, onDelete, onImageUpload, availableTags }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: asana.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="yoga-card relative group">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={asana.name}
            onChange={(e) => onUpdate(asana.id, { name: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            placeholder="Asana name"
          />
          <div className="relative h-48 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
            {asana.imageUrl ? (
              <div className="relative w-full h-full group">
                <img
                  src={asana.imageUrl}
                  alt={asana.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer text-white hover:text-gray-200">
                    <span>Replace image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onImageUpload(asana.id, e)}
                      className="hidden"
                    />
                  </label>
                </div>
                <PencilIcon className="h-5 w-5 absolute top-2 right-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <div className="text-center p-4">
                <label className="cursor-pointer text-gray-500 hover:text-gray-700">
                  <span>Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onImageUpload(asana.id, e)}
                    className="hidden"
                  />
                </label>
              </div>
            )}
            {asana.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {asana.tags.map(tag => (
                  <TagBadge
                    key={tag}
                    tag={tag}
                    className="bg-blue-50 text-blue-700 text-xs"
                  />
                ))}
              </div>
            )}
          </div>
          <textarea
            value={asana.note}
            onChange={(e) => onUpdate(asana.id, { note: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            placeholder="Add notes"
            rows="3"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {asana.tags.map(tag => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  className="bg-blue-100 text-blue-800"
                  onRemove={() => {
                    onUpdate(asana.id, {
                      tags: asana.tags.filter(t => t !== tag)
                    })
                  }}
                />
              ))}
            </div>
            <select
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              value=""
              onChange={(e) => {
                const tag = e.target.value
                if (tag && !asana.tags.includes(tag)) {
                  onUpdate(asana.id, {
                    tags: [...asana.tags, tag]
                  })
                }
              }}
            >
              <option value="">Add a tag...</option>
              {availableTags
                .filter(tag => !asana.tags.includes(tag))
                .map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(null)}
              className="flex-1 bg-gray-100 text-gray-600 py-2 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (asana.name.trim() !== '') {
                  onEdit(null);
                }
              }}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => onDelete(asana.id)}
              className="px-4 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{asana.name}</h3>
            <div className="flex gap-2">
              <div className="cursor-pointer" onClick={() => onEdit(asana.id)}>
                <PencilIcon className="h-5 w-5 text-gray-400" />
              </div>
              <button {...listeners} className="p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing">
                <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
          {asana.imageUrl && (
            <div className="h-48 mb-2 rounded overflow-hidden">
              <img
                src={asana.imageUrl}
                alt={asana.name}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <p className="text-gray-600">{asana.note}</p>
        </div>
      )}
    </div>
  )
}

function TagInput({ availableTags, onCreateTag, onRemoveTag, onRenameTag }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const trimmedInput = input.trim()
    if (trimmedInput && !availableTags.includes(trimmedInput)) {
      onCreateTag(trimmedInput)
      setInput('')
    }
  }

  const handleRemove = () => {
    const trimmedInput = input.trim()
    if (trimmedInput && availableTags.includes(trimmedInput)) {
      if (window.confirm(`Are you sure you want to remove the tag "${trimmedInput}"? This will remove it from all cards.`)) {
        onRemoveTag(trimmedInput)
        setInput('')
      }
    }
  }

  const handleRename = () => {
    const trimmedInput = input.trim()
    if (trimmedInput && availableTags.includes(trimmedInput)) {
      const newName = window.prompt(`Enter new name for tag "${trimmedInput}":`, trimmedInput)
      if (newName && newName.trim() && newName.trim() !== trimmedInput) {
        onRenameTag(trimmedInput, newName.trim())
        setInput('')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Tag name"
        className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
        list="available-tags"
      />
      <datalist id="available-tags">
        {availableTags.map(tag => (
          <option key={tag} value={tag} />
        ))}
      </datalist>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add
      </button>
      <button
        type="button"
        onClick={handleRename}
        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
      >
        Rename
      </button>
      <button
        type="button"
        onClick={handleRemove}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Remove
      </button>
    </form>
  )
}

function TagBadge({ tag, onRemove, onClick, className = '' }) {
  const handleRemove = (e) => {
    e.stopPropagation()
    onRemove()
  }

  return (
    <span 
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${className}`}
    >
      {tag}
      {onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className="hover:text-red-500 ml-1"
        >
          ×
        </button>
      )}
    </span>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [asanas, setAsanas] = useState(() => {
    const savedAsanas = localStorage.getItem('asanas')
    const parsed = savedAsanas ? JSON.parse(savedAsanas) : []
    // Ensure all asanas have a tags array
    return parsed.map(asana => ({
      ...asana,
      tags: asana.tags || []
    }))
  })
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('tags')
    return savedTags ? JSON.parse(savedTags) : []
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [editingId, setEditingId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    localStorage.setItem('asanas', JSON.stringify(asanas))
  }, [asanas])

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags))
  }, [tags])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setAsanas((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        const newItems = [...items]
        const [removed] = newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, removed)

        return newItems
      })
    }
  }

  const deleteAsana = (id) => {
    setAsanas(asanas.filter(asana => asana.id !== id))
    setEditingId(null)
  }

  const addAsana = () => {
    const newAsana = {
      id: Date.now(),
      name: 'New Asana',
      note: 'Click to add notes',
      imageUrl: '',
      tags: []
    }
    setAsanas([...asanas, newAsana])
    setEditingId(newAsana.id)
  }

  const updateAsana = (id, updates) => {
    setAsanas(asanas.map(asana => 
      asana.id === id ? { 
        ...asana, 
        ...updates,
        tags: updates.tags || asana.tags || [] 
      } : asana
    ))
  }

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateAsana(id, { imageUrl: reader.result })
      }
      reader.readAsDataURL(file)
    }
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
          <h2 className="text-2xl font-bold mb-6">Asana List</h2>
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
          {/* Tags Management */}
          <div className="mb-8 space-y-4">
            <h3 className="text-lg font-semibold">Tags</h3>
            <TagInput
              availableTags={tags}
              onCreateTag={(newTag) => {
                setTags(prevTags => [...prevTags, newTag])
              }}
              onRemoveTag={(tagToRemove) => {
                setTags(prevTags => prevTags.filter(t => t !== tagToRemove))
                setSelectedTags(prevSelected => prevSelected.filter(t => t !== tagToRemove))
                // Remove tag from all asanas
                setAsanas(prevAsanas => prevAsanas.map(asana => ({
                  ...asana,
                  tags: asana.tags.filter(t => t !== tagToRemove)
                })))
              }}
              onRenameTag={(oldTag, newTag) => {
                if (!tags.includes(newTag)) {
                  setTags(prevTags => prevTags.map(t => t === oldTag ? newTag : t))
                  setSelectedTags(prevSelected => prevSelected.map(t => t === oldTag ? newTag : t))
                  // Update tag in all asanas
                  setAsanas(prevAsanas => prevAsanas.map(asana => ({
                    ...asana,
                    tags: asana.tags.map(t => t === oldTag ? newTag : t)
                  })))
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  className={`${selectedTags.includes(tag) 
                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                    : 'bg-gray-100 text-gray-800 border-gray-300'} 
                    cursor-pointer border hover:bg-opacity-75`}
                  onRemove={
                    !asanas.some(a => a.tags?.includes(tag)) 
                      ? () => {
                          setTags(prevTags => prevTags.filter(t => t !== tag));
                          setSelectedTags(prevSelected => prevSelected.filter(t => t !== tag));
                        }
                      : undefined
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )
                  }}
                />
              ))}
            </div>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <SortableContext
                items={asanas.map(a => a.id)}
                strategy={verticalListSortingStrategy}
              >
                {asanas
                  .filter(asana => 
                    selectedTags.length === 0 || 
                    selectedTags.every(tag => asana.tags?.includes(tag))
                  )
                  .map(asana => (
                    <SortableAsanaCard
                      key={asana.id}
                      asana={asana}
                      isEditing={editingId === asana.id}
                      onEdit={setEditingId}
                      onUpdate={updateAsana}
                      onDelete={deleteAsana}
                      onImageUpload={handleImageUpload}
                      availableTags={tags}
                    />
                  ))}
              </SortableContext>
            </div>
          </DndContext>
          
          {/* Add new asana card */}
          <button
            onClick={addAsana}
            className="mt-6 w-full border-2 border-dashed border-gray-300 rounded-lg p-4 h-[200px] flex items-center justify-center hover:border-gray-400 transition-colors duration-200"
          >
            <PlusIcon className="h-12 w-12 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
