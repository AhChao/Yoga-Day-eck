# React Guide for Beginners

## Table of Contents
1. [React Basics](#react-basics)
2. [Project Structure](#project-structure)
3. [Component Examples](#component-examples)
4. [State and Props](#state-and-props)
5. [Hooks Guide](#hooks-guide)
6. [Event Handling](#event-handling)

## React Basics

### What is React?
React is a JavaScript library for building user interfaces. In our project, we use React to create a dynamic yoga flow builder application.

### Key Concepts
1. **Components**: Reusable UI pieces
2. **Props**: Data passed to components
3. **State**: Internal component data
4. **JSX**: HTML-like syntax in JavaScript

## Project Structure

### Main Files
```
src/
├── App.jsx              # Main application component
├── index.jsx           # Entry point
└── components/         # Reusable components
    ├── FlowCard.jsx    # Flow display component
    ├── AsanaCard.jsx   # Asana display component
    └── TagBadge.jsx    # Tag display component
```

### Component Breakdown
Each component is structured like this:
```javascript
// 1. Imports
import React, { useState } from 'react';

// 2. Component definition
function ComponentName({ prop1, prop2 }) {
  // 3. State declarations
  const [state, setState] = useState(initialValue);

  // 4. Helper functions
  const handleSomething = () => {
    // Logic here
  };

  // 5. Return JSX
  return (
    <div>
      {/* UI elements */}
    </div>
  );
}

// 6. Export
export default ComponentName;
```

## Component Examples

### Simple Component (TagBadge)
```jsx
// This is a simple component that displays a tag
function TagBadge({ tag, onRemove }) {
  return (
    <div className="bg-blue-100 text-blue-800 rounded-full px-3 py-1">
      {tag}
      {onRemove && (
        <button onClick={onRemove}>×</button>
      )}
    </div>
  );
}
```

### Complex Component (FlowCard)
```jsx
function FlowCard({ flow, onEdit }) {
  // 1. State for editing
  const [isEditing, setIsEditing] = useState(false);

  // 2. Event handler
  const handleNameChange = (e) => {
    onEdit({ ...flow, name: e.target.value });
  };

  // 3. Conditional rendering
  return (
    <div className="card">
      {isEditing ? (
        <input value={flow.name} onChange={handleNameChange} />
      ) : (
        <h3>{flow.name}</h3>
      )}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Save' : 'Edit'}
      </button>
    </div>
  );
}
```

## State and Props

### Props Example
```jsx
// 1. Parent component
function ParentComponent() {
  const data = "Hello";
  return <ChildComponent message={data} />;
}

// 2. Child component
function ChildComponent({ message }) {
  return <div>{message}</div>;
}
```

### State Example
```jsx
function Counter() {
  // 1. Declare state
  const [count, setCount] = useState(0);

  // 2. Update state
  const increment = () => {
    setCount(count + 1);
  };

  // 3. Use state in render
  return (
    <div>
      Count: {count}
      <button onClick={increment}>+</button>
    </div>
  );
}
```

## Hooks Guide

### useState
Used for component-level state management:
```jsx
function AsanaSelector() {
  // Format: const [value, setValue] = useState(initialValue);
  const [selectedAsana, setSelectedAsana] = useState(null);

  return (
    <select onChange={(e) => setSelectedAsana(e.target.value)}>
      <option value="1">Downward Dog</option>
      <option value="2">Warrior I</option>
    </select>
  );
}
```

### useEffect
For side effects and lifecycle events:
```jsx
function FlowTimer({ duration }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // Runs when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Cleanup example
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    // Cleanup function
    return () => clearInterval(timer);
  }, []);

  return <div>{timeLeft} seconds left</div>;
}
```

## Event Handling

### Click Events
```jsx
function DeleteButton({ onDelete }) {
  const handleClick = (e) => {
    // Prevent default behavior
    e.preventDefault();
    // Call parent handler
    onDelete();
  };

  return (
    <button onClick={handleClick}>
      Delete
    </button>
  );
}
```

### Form Events
```jsx
function FlowForm({ onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

## Real Project Examples

### Flow Management
```jsx
// In App.jsx
function App() {
  // 1. State for all flows
  const [flows, setFlows] = useState([]);

  // 2. Add new flow
  const addFlow = (newFlow) => {
    setFlows([...flows, newFlow]);
  };

  // 3. Update flow
  const updateFlow = (flowId, updates) => {
    setFlows(flows.map(flow =>
      flow.id === flowId ? { ...flow, ...updates } : flow
    ));
  };

  // 4. Render flows
  return (
    <div>
      {flows.map(flow => (
        <FlowCard
          key={flow.id}
          flow={flow}
          onUpdate={(updates) => updateFlow(flow.id, updates)}
        />
      ))}
    </div>
  );
}
```

### Asana Selection
```jsx
function AsanaSelector({ flow, onAsanaAdd }) {
  // 1. State for selected asana
  const [selected, setSelected] = useState('');

  // 2. Handle selection
  const handleChange = (e) => {
    const asanaId = e.target.value;
    setSelected(asanaId);
    onAsanaAdd(asanaId);
  };

  // 3. Render dropdown
  return (
    <select value={selected} onChange={handleChange}>
      <option value="">Select an asana...</option>
      {availableAsanas.map(asana => (
        <option key={asana.id} value={asana.id}>
          {asana.name}
        </option>
      ))}
    </select>
  );
}
```

## Common Patterns

### Conditional Rendering
```jsx
function FlowCard({ flow, isEditing }) {
  return (
    <div>
      {/* If/else rendering */}
      {isEditing ? (
        <input value={flow.name} />
      ) : (
        <h3>{flow.name}</h3>
      )}

      {/* Conditional element */}
      {isEditing && (
        <button>Save</button>
      )}
    </div>
  );
}
```

### List Rendering
```jsx
function AsanaList({ asanas }) {
  return (
    <div>
      {asanas.map(asana => (
        <AsanaCard
          key={asana.id}
          asana={asana}
        />
      ))}
    </div>
  );
}
```

### Form Handling
```jsx
function FlowForm() {
  // 1. Form state
  const [formData, setFormData] = useState({
    name: '',
    duration: 30
  });

  // 2. Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 3. Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  // 4. Form render
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="duration"
        type="number"
        value={formData.duration}
        onChange={handleChange}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```
