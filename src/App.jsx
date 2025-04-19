import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'
import { DndContext, useSensors, useSensor, PointerSensor, KeyboardSensor, closestCenter, useDraggable, useDroppable } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableAsanaCard({ asana, isEditing, onEdit, onUpdate, onDelete, onImageUpload, availableTags }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: asana.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style} {...attributes} className="yoga-card relative group">
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
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{asana.name}</h3>
                {asana.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
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
              <div className="flex gap-2">
                <div className="cursor-pointer" onClick={() => onEdit(asana.id)}>
                  <PencilIcon className="h-5 w-5 text-gray-400" />
                </div>
                <button {...listeners} className="p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing">
                  <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                </button>
                <button
                  onClick={() => onDelete(asana.id)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <TrashIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            {asana.imageUrl && (
              <img
                src={asana.imageUrl}
                alt={asana.name}
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
            )}
            <p className="text-gray-600 mt-2">{asana.note}</p>
          </div>
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

function FlowCard({ flow, onEdit, onDelete, asanas, availableAsanas, onUpdateFlow, isEditing }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `flow-${flow.id}`,
    data: {
      flowId: flow.id,
      accepts: 'asana'
    }
  })

  if (isEditing) {
    return (
      <div className="p-4 bg-white rounded-lg shadow space-y-4">
        <div className="space-y-4">
          <input
            type="text"
            value={flow.name}
            onChange={(e) => onUpdateFlow(flow.id, { name: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Flow name"
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={flow.duration}
              onChange={(e) => onUpdateFlow(flow.id, { duration: parseInt(e.target.value) || 0 })}
              className="block w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Duration"
              min="0"
            />
            <span className="self-center text-gray-500">minutes</span>
          </div>
          <textarea
            value={flow.description}
            onChange={(e) => onUpdateFlow(flow.id, { description: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Flow description"
            rows={3}
          />
          <TagInput
            value={flow.tags}
            availableTags={availableTags}
            onChange={(newTags) => onUpdateFlow(flow.id, { tags: newTags })}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(null)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={setNodeRef}
      className={`p-4 bg-white rounded-lg shadow ${isOver ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold">{flow.name}</h3>
          {flow.tags?.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {flow.tags.map(tag => (
                <TagBadge
                  key={tag}
                  tag={tag}
                  className="bg-blue-50 text-blue-700 text-xs"
                />
              ))}
            </div>
          )}
          <div className="mt-2 text-sm text-gray-500">{flow.duration} minutes</div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(flow.id)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <PencilIcon className="h-5 w-5 text-gray-400" />
          </button>
          <button
            onClick={() => onDelete(flow.id)}
            className="p-1 rounded hover:bg-gray-100"
          >
            <TrashIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{flow.description}</p>
      <div className="space-y-2">
        {flow.asanaIds.map((asanaId, index) => {
          const asana = asanas.find(a => a.id === asanaId)
          if (!asana) return null
          return (
            <div key={asanaId} className="flex items-center gap-2">
              <div className="text-gray-400">{index + 1}.</div>
              <div className="flex-1 p-2 bg-gray-50 rounded">
                <div className="font-medium">{asana.name}</div>
                {asana.tags?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
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
              <button
                onClick={() => {
                  onUpdateFlow(flow.id, {
                    asanaIds: flow.asanaIds.filter(id => id !== asanaId)
                  })
                }}
                className="p-1 rounded hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('cards') // 'cards' or 'flows'
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [asanas, setAsanas] = useState(() => {
    const savedAsanas = localStorage.getItem('asanas')
    const parsed = savedAsanas ? JSON.parse(savedAsanas) : []
    return parsed.map(asana => ({
      ...asana,
      tags: asana.tags || []
    }))
  })
  const [flows, setFlows] = useState(() => {
    const savedFlows = localStorage.getItem('flows')
    const parsed = savedFlows ? JSON.parse(savedFlows) : []
    return parsed.map(flow => ({
      ...flow,
      tags: flow.tags || [],
      asanaIds: flow.asanaIds || []
    }))
  })
  const [tags, setTags] = useState(() => {
    const savedTags = localStorage.getItem('tags')
    return savedTags ? JSON.parse(savedTags) : []
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingFlowId, setEditingFlowId] = useState(null)

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
    localStorage.setItem('flows', JSON.stringify(flows))
  }, [flows])

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags))
  }, [tags])

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) return

    if (over.data?.current?.accepts === 'asana') {
      // Dropping an asana into a flow
      const flowId = over.data.current.flowId
      const flow = flows.find(f => f.id === flowId)
      if (flow && !flow.asanaIds.includes(active.id)) {
        updateFlow(flowId, {
          asanaIds: [...flow.asanaIds, active.id]
        })
      }
    } else if (active.id !== over.id) {
      // Reordering asanas in the cards view
      setAsanas((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
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

  const addFlow = () => {
    const newFlow = {
      id: Date.now(),
      name: 'New Flow',
      description: 'Click to add description',
      duration: 30,
      tags: [],
      asanaIds: []
    }
    setFlows([...flows, newFlow])
    setEditingFlowId(newFlow.id)
  }

  const updateFlow = (id, updates) => {
    setFlows(flows.map(flow =>
      flow.id === id ? { ...flow, ...updates } : flow
    ))
  }

  const deleteFlow = (id) => {
    setFlows(flows.filter(flow => flow.id !== id))
    if (editingFlowId === id) {
      setEditingFlowId(null)
    }
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

  const filteredAsanas = asanas.filter(asana => {
    if (selectedTags.length === 0) return true;
    return selectedTags.every(tag => asana.tags.includes(tag));
  });

  const filteredFlows = flows.filter(flow => {
    if (selectedTags.length === 0) return true;
    return selectedTags.every(tag => flow.tags.includes(tag));
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-50 p-4 md:hidden">
        <button
          className="p-2 rounded-md bg-white shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Yoga Day</h2>
            </div>

            <div className="space-y-2 mb-4">
              <button
                onClick={() => setActiveTab('cards')}
                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'cards' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
              >
                Cards
              </button>
              <button
                onClick={() => setActiveTab('flows')}
                className={`w-full text-left px-4 py-2 rounded-md ${activeTab === 'flows' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
              >
                Flows
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <button
                onClick={activeTab === 'cards' ? addAsana : addFlow}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 h-[60px] flex items-center justify-center hover:border-gray-400 transition-colors duration-200 bg-white"
              >
                <PlusIcon className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-gray-600">{activeTab === 'cards' ? 'New Asana' : 'New Flow'}</span>
              </button>
            </div>

            {/* Tags Management */}
            <hr className="my-4 border-gray-200" />

            <div className="space-y-4">
              <button
                onClick={activeTab === 'cards' ? addAsana : addFlow}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 h-[60px] flex items-center justify-center hover:border-gray-400 transition-colors duration-200 bg-white"
              >
                <PlusIcon className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-gray-600">{activeTab === 'cards' ? 'New Asana' : 'New Flow'}</span>
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Tags</h3>
              <TagInput
                availableTags={tags}
                onCreateTag={(newTag) => {
                  setTags((prevTags) => [...prevTags, newTag]);
                }}
                onRemoveTag={(tagToRemove) => {
                  setTags((prevTags) => prevTags.filter((t) => t !== tagToRemove));
                  setSelectedTags((prevSelected) => prevSelected.filter((t) => t !== tagToRemove));
                  setAsanas((prevAsanas) =>
                    prevAsanas.map((asana) => ({
                      ...asana,
                      tags: asana.tags.filter((t) => t !== tagToRemove),
                    }))
                  );
                }}
                onRenameTag={(oldTag, newTag) => {
                  if (!tags.includes(newTag)) {
                    setTags((prevTags) => [
                      ...prevTags.filter((t) => t !== oldTag),
                      newTag,
                    ]);
                    setSelectedTags((prevSelected) => [
                      ...prevSelected.filter((t) => t !== oldTag),
                      ...(prevSelected.includes(oldTag) ? [newTag] : []),
                    ]);
                    setAsanas((prevAsanas) =>
                      prevAsanas.map((asana) => ({
                        ...asana,
                        tags: asana.tags.map((t) => (t === oldTag ? newTag : t)),
                      }))
                    );
                  }
                }}
                value={selectedTags}
                onChange={setSelectedTags}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12">
          {activeTab === 'cards' ? (
            <>
              {/* Asana cards grid */}
              <DndContext
                onDragEnd={handleDragEnd}
                sensors={sensors}
                collisionDetection={closestCenter}
              >
                <SortableContext items={asanas.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid grid-cols-1 gap-6">
                    {filteredAsanas.map((asana) => (
                      <SortableAsanaCard
                        key={asana.id}
                        asana={asana}
                        isEditing={editingAsanaId === asana.id}
                        onEdit={setEditingAsanaId}
                        onUpdate={updateAsana}
                        onDelete={deleteAsana}
                        onImageUpload={handleImageUpload}
                        availableTags={tags}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          ) : (
            <>
              {/* Flows grid */}
              <div className="grid grid-cols-1 gap-6">
                {filteredFlows.map((flow) => (
                  <FlowCard
                    key={flow.id}
                    flow={flow}
                    onEdit={setEditingFlowId}
                    onDelete={deleteFlow}
                    asanas={asanas}
                    availableAsanas={asanas.filter(asana => !flow.asanaIds.includes(asana.id))}
                    onUpdateFlow={updateFlow}
                    isEditing={editingFlowId === flow.id}
                    availableTags={tags}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
