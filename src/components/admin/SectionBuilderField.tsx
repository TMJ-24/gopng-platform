'use client'

import { useState } from 'react'
import { useField } from '@payloadcms/ui'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  arrayMove, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type SectionRow = { id?: string; type: string; enabled: boolean }

const SECTION_META: Record<string, { label: string; color: string; description: string }> = {
  hero:      { label: 'Hero',         color: '#7c3aed', description: 'Full-width hero banner with search bar and call to action' },
  services:  { label: 'Services',     color: '#2563eb', description: 'Citizen-facing services grid' },
  stats:     { label: 'Stats',        color: '#0891b2', description: 'Key metrics and statistics counter' },
  news:      { label: 'News',         color: '#d97706', description: 'Latest government news and announcements' },
  directory: { label: 'Directory',    color: '#059669', description: 'Agency and department directory listing' },
  opendata:  { label: 'Open Data',    color: '#dc2626', description: 'Open data portal links and datasets' },
  about:     { label: 'About',        color: '#374151', description: 'Agency mission statement and overview' },
  cta:       { label: 'Contact CTA',  color: '#be185d', description: 'Contact-us call-to-action banner' },
}

const ALL_TYPES = Object.keys(SECTION_META)

function DragHandleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="4" y="3" width="2" height="2" rx="1" />
      <rect x="10" y="3" width="2" height="2" rx="1" />
      <rect x="4" y="7" width="2" height="2" rx="1" />
      <rect x="10" y="7" width="2" height="2" rx="1" />
      <rect x="4" y="11" width="2" height="2" rx="1" />
      <rect x="10" y="11" width="2" height="2" rx="1" />
    </svg>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      style={{
        position: 'relative', width: 40, height: 22, borderRadius: 11,
        border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0,
        background: checked ? '#16a34a' : '#d1d5db',
        transition: 'background 0.2s',
      }}
    >
      <span style={{
        position: 'absolute', top: 3, width: 16, height: 16,
        left: checked ? 21 : 3,
        borderRadius: '50%', background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}

function SortableRow({
  row, index, onToggle, onRemove,
}: {
  row: SectionRow
  index: number
  onToggle: () => void
  onRemove: () => void
}) {
  const rowId = row.id ?? row.type
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: rowId })
  const meta = SECTION_META[row.type] ?? { label: row.type, color: '#6b7280', description: '' }

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
        zIndex: isDragging ? 999 : 'auto',
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', marginBottom: 6, borderRadius: 8,
        border: `1px solid ${row.enabled ? '#e5e7eb' : '#f3f4f6'}`,
        background: row.enabled ? 'white' : '#fafafa',
        boxShadow: isDragging ? '0 4px 16px rgba(0,0,0,0.12)' : 'none',
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: 11, color: '#d1d5db', width: 18, textAlign: 'center', flexShrink: 0, fontWeight: 700 }}>
        {index + 1}
      </span>

      <button
        type="button"
        aria-label="Drag to reorder"
        style={{
          color: '#c4c4c4', background: 'none', border: 'none',
          padding: 2, lineHeight: 0, cursor: 'grab', flexShrink: 0, touchAction: 'none',
        }}
        {...attributes}
        {...listeners}
      >
        <DragHandleIcon />
      </button>

      <div style={{
        width: 6, height: 36, borderRadius: 3, flexShrink: 0,
        background: row.enabled ? meta.color : '#e5e7eb',
        transition: 'background 0.2s',
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: row.enabled ? '#111827' : '#9ca3af', lineHeight: 1.3 }}>
          {meta.label}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {meta.description}
        </div>
      </div>

      <span style={{
        fontSize: 10, padding: '2px 8px', borderRadius: 20, fontFamily: 'monospace',
        background: '#f3f4f6', color: '#6b7280', flexShrink: 0, fontWeight: 600,
      }}>
        {row.type}
      </span>

      <Toggle checked={row.enabled} onChange={onToggle} />

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${meta.label} section`}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#d1d5db', padding: 2, lineHeight: 0, flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#d1d5db' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

type FieldProps = { path: string; [key: string]: unknown }

export function SectionBuilderField({ path }: FieldProps) {
  const { value, setValue } = useField<SectionRow[]>({ path })
  const rows: SectionRow[] = Array.isArray(value) ? value : []
  const [showAdd, setShowAdd] = useState(false)

  const available = ALL_TYPES.filter(t => !rows.some(r => r.type === t))
  const enabledCount = rows.filter(r => r.enabled).length

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = rows.findIndex(r => (r.id ?? r.type) === active.id)
    const to   = rows.findIndex(r => (r.id ?? r.type) === over.id)
    if (from !== -1 && to !== -1) setValue(arrayMove(rows, from, to))
  }

  const toggle = (type: string) =>
    setValue(rows.map(r => r.type === type ? { ...r, enabled: !r.enabled } : r))

  const remove = (type: string) =>
    setValue(rows.filter(r => r.type !== type))

  const add = (type: string) => {
    setValue([...rows, { type, enabled: true }])
    if (available.length <= 1) setShowAdd(false)
  }

  return (
    <div style={{ fontFamily: 'inherit', paddingBottom: 4 }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: '#9ca3af' }}>
          {rows.length === 0
            ? 'No sections — add one to start building.'
            : `${enabledCount} of ${rows.length} section${rows.length !== 1 ? 's' : ''} enabled · drag rows to reorder`}
        </span>

        {available.length > 0 && (
          <button
            type="button"
            onClick={() => setShowAdd(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
              background: showAdd ? '#f3f4f6' : '#111827',
              color: showAdd ? '#374151' : 'white',
              border: `1px solid ${showAdd ? '#d1d5db' : '#111827'}`,
              cursor: 'pointer',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {showAdd
                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                : <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>}
            </svg>
            {showAdd ? 'Cancel' : 'Add Section'}
          </button>
        )}
      </div>

      {/* Add-section picker */}
      {showAdd && available.length > 0 && (
        <div style={{
          marginBottom: 12, padding: 12,
          border: '1px dashed #d1d5db', borderRadius: 8, background: '#f9fafb',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))', gap: 6,
        }}>
          {available.map(type => {
            const meta = SECTION_META[type]
            return (
              <button
                key={type}
                type="button"
                onClick={() => add(type)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', borderRadius: 6, cursor: 'pointer',
                  background: 'white', border: '1px solid #e5e7eb',
                  textAlign: 'left', fontSize: 13, fontWeight: 600, color: '#111827',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = meta.color; e.currentTarget.style.background = '#fafafa' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white' }}
              >
                <div style={{ width: 6, height: 22, borderRadius: 3, background: meta.color, flexShrink: 0 }} />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {meta.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {rows.length === 0 && (
        <div style={{
          padding: '28px 16px', textAlign: 'center',
          border: '2px dashed #e5e7eb', borderRadius: 8, color: '#9ca3af', fontSize: 13,
        }}>
          Click <strong>Add Section</strong> above to build the homepage layout.
        </div>
      )}

      {/* Sortable list */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={rows.map(r => r.id ?? r.type)} strategy={verticalListSortingStrategy}>
          {rows.map((row, i) => (
            <SortableRow
              key={row.id ?? row.type}
              row={row}
              index={i}
              onToggle={() => toggle(row.type)}
              onRemove={() => remove(row.type)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
