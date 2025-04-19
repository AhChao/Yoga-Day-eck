# Yoga Flow Builder Documentation

## Overview
Yoga Flow Builder is a React-based web application that allows users to create, manage, and organize yoga flows. Each flow consists of a sequence of asanas (yoga poses) and can be tagged for easy organization and filtering.

## Table of Contents
1. [Features](#features)
2. [Technical Stack](#technical-stack)
3. [Project Structure](#project-structure)
4. [Components](#components)
5. [State Management](#state-management)
6. [Data Models](#data-models)
7. [User Interface](#user-interface)

## Features

### Flow Management
- Create new yoga flows with names and descriptions
- Set duration for each flow
- Add and remove asanas in a sequence
- Drag and drop to reorder asanas
- Tag flows for organization
- Filter flows by tags
- Edit existing flows
- Delete flows

### Asana Management
- View asana details including:
  - Name
  - Description
  - Difficulty level
  - Benefits
  - Tags
- Add and remove asanas from flows
- Reorder asanas within a flow

### Tag System
- Add custom tags to flows
- Filter flows by tags
- Manage tags across the application
- Remove tags from flows

## Technical Stack

### Core Technologies
- React 18
- Vite (Build tool)
- TailwindCSS (Styling)
- React DnD (Drag and Drop)
- LocalStorage (Data persistence)

### Key Libraries
- @heroicons/react: UI icons
- @dnd-kit/core: Drag and drop functionality
- @dnd-kit/sortable: Sortable list implementation
- tailwindcss: Utility-first CSS framework

## Project Structure

### Key Directories
\`\`\`
/src
  /components
    - FlowCard.jsx       # Flow display and management
    - AsanaCard.jsx      # Asana display
    - TagBadge.jsx       # Tag display
  App.jsx               # Main application component
  index.css            # Global styles
/public                # Static assets
/docs                  # Documentation
\`\`\`

## Components

### FlowCard
Main component for displaying and managing yoga flows.

#### Props
- \`flow\`: Flow object containing flow data
- \`onEdit\`: Function to handle edit mode
- \`onDelete\`: Function to handle flow deletion
- \`asanas\`: Array of available asanas
- \`availableAsanas\`: Filtered array of asanas not in flow
- \`onUpdateFlow\`: Function to update flow data
- \`isEditing\`: Boolean for edit mode state
- \`availableTags\`: Array of available tags

#### Features
- Display flow name, description, and duration
- Show asanas in sequence
- Manage tags
- Edit mode for modifications
- Drag and drop asana reordering

### AsanaCard
Component for displaying individual asanas.

#### Props
- \`asana\`: Asana object with pose data
- \`onRemove\`: Optional function for removal
- \`index\`: Position in sequence
- \`dragHandle\`: Optional drag handle for reordering

### TagBadge
Component for displaying and managing tags.

#### Props
- \`tag\`: Tag text
- \`onRemove\`: Optional function for tag removal

## State Management

### Main State Objects
1. Flows Array
   - Stores all yoga flows
   - Managed in App.jsx
   - Persisted in localStorage

2. Asanas Array
   - Contains all available asanas
   - Static data loaded on init
   - Used for asana selection

3. Tags Array
   - Stores all available tags
   - Managed globally
   - Used for filtering and organization

### State Updates
- Flow updates use immutable patterns
- LocalStorage sync on state changes
- Optimistic updates for UI responsiveness

## Data Models

### Flow Object
\`\`\`javascript
{
  id: string,
  name: string,
  description: string,
  duration: number,
  asanaIds: string[],
  tags: string[]
}
\`\`\`

### Asana Object
\`\`\`javascript
{
  id: string,
  name: string,
  description: string,
  difficulty: string,
  benefits: string[],
  tags: string[]
}
\`\`\`

## User Interface

### Layout
- Responsive grid system
- Mobile-first design
- Clean, minimalist aesthetic

### Interactions
1. Flow Creation
   - Click "New Flow" button
   - Fill in basic details
   - Add asanas and tags
   - Save changes

2. Flow Editing
   - Click edit button on flow card
   - Modify details in-place
   - Drag and drop asanas
   - Click "Done" to save

3. Flow Filtering
   - Select tags from filter bar
   - Real-time flow filtering
   - Clear filters option

### Styling
- TailwindCSS utility classes
- Consistent color scheme
- Responsive spacing
- Smooth transitions
- Clear visual hierarchy
