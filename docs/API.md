# API Documentation

## Components API

### FlowCard

#### Props Interface
```typescript
interface FlowCardProps {
  flow: {
    id: string;
    name: string;
    description: string;
    duration: number;
    asanaIds: string[];
    tags: string[];
  };
  onEdit: (flow: Flow | null) => void;
  onDelete: (flowId: string) => void;
  asanas: Asana[];
  availableAsanas: Asana[];
  onUpdateFlow: (updates: Partial<Flow>) => void;
  isEditing: boolean;
  availableTags: string[];
}
```

#### Methods
```typescript
// Internal handlers
handleChange(changes: Partial<Flow>): void
// Updates flow with new changes

// Event handlers
handleTagAdd(tag: string): void
// Adds new tag to flow

handleTagRemove(tag: string): void
// Removes tag from flow

handleAsanaAdd(asanaId: string): void
// Adds asana to flow sequence

handleAsanaRemove(index: number): void
// Removes asana at index from sequence

handleAsanaReorder(oldIndex: number, newIndex: number): void
// Reorders asana in sequence
```

### AsanaCard

#### Props Interface
```typescript
interface AsanaCardProps {
  asana: {
    id: string;
    name: string;
    description: string;
    difficulty: string;
    benefits: string[];
    tags: string[];
  };
  onRemove?: () => void;
  index?: number;
  dragHandle?: React.ReactNode;
}
```

### TagBadge

#### Props Interface
```typescript
interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
}
```

## State Management API

### Flow Management

#### Types
```typescript
interface Flow {
  id: string;
  name: string;
  description: string;
  duration: number;
  asanaIds: string[];
  tags: string[];
}

type FlowUpdates = Partial<Flow>;
```

#### Methods
```typescript
// Create new flow
createFlow(): Flow

// Update flow
updateFlow(flowId: string, updates: FlowUpdates): void

// Delete flow
deleteFlow(flowId: string): void

// Filter flows
filterFlowsByTags(flows: Flow[], tags: string[]): Flow[]
```

### Asana Management

#### Types
```typescript
interface Asana {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  benefits: string[];
  tags: string[];
}
```

#### Methods
```typescript
// Get available asanas
getAvailableAsanas(flow: Flow, allAsanas: Asana[]): Asana[]

// Get asana by ID
getAsanaById(id: string, asanas: Asana[]): Asana | undefined
```

### Tag Management

#### Methods
```typescript
// Add tag to flow
addTagToFlow(flow: Flow, tag: string): Flow

// Remove tag from flow
removeTagFromFlow(flow: Flow, tag: string): Flow

// Get all unique tags
getAllTags(flows: Flow[]): string[]
```

## LocalStorage API

### Keys
```typescript
const STORAGE_KEYS = {
  FLOWS: 'yoga-flows',
  TAGS: 'flow-tags',
  SETTINGS: 'app-settings'
};
```

### Methods
```typescript
// Save flows
saveFlows(flows: Flow[]): void

// Load flows
loadFlows(): Flow[]

// Save tags
saveTags(tags: string[]): void

// Load tags
loadTags(): string[]
```

## Drag and Drop API

### Types
```typescript
interface DragItem {
  id: string;
  type: string;
  index: number;
}
```

### Methods
```typescript
// Handle drop
handleDrop(dragIndex: number, dropIndex: number): void

// Get drag style
getDragStyle(isDragging: boolean): React.CSSProperties
```

## Events

### Flow Events
```typescript
// Flow updated
onFlowUpdate: (flow: Flow) => void

// Flow deleted
onFlowDelete: (flowId: string) => void

// Flow created
onFlowCreate: (flow: Flow) => void
```

### Asana Events
```typescript
// Asana added to flow
onAsanaAdd: (flowId: string, asanaId: string) => void

// Asana removed from flow
onAsanaRemove: (flowId: string, index: number) => void

// Asanas reordered
onAsanaReorder: (flowId: string, oldIndex: number, newIndex: number) => void
```

### Tag Events
```typescript
// Tag added
onTagAdd: (flowId: string, tag: string) => void

// Tag removed
onTagRemove: (flowId: string, tag: string) => void
```

## Error Handling

### Error Types
```typescript
interface AppError {
  code: string;
  message: string;
  details?: any;
}
```

### Error Codes
```typescript
const ERROR_CODES = {
  FLOW_NOT_FOUND: 'FLOW_NOT_FOUND',
  ASANA_NOT_FOUND: 'ASANA_NOT_FOUND',
  INVALID_OPERATION: 'INVALID_OPERATION',
  STORAGE_ERROR: 'STORAGE_ERROR'
};
```

### Error Handlers
```typescript
// Handle flow errors
handleFlowError(error: AppError): void

// Handle storage errors
handleStorageError(error: AppError): void

// Handle drag and drop errors
handleDndError(error: AppError): void
```
