import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskCard from '../TaskCard/TaskCard'
import AddTask from '../AddTask/AddTask'

const COLUMNS = [
  { id: 'todo', title: 'עדיין לא התחיל', color: 'bg-gray-400', lightBg: 'bg-gray-50' },
  { id: 'in_progress', title: 'בביצוע', color: 'bg-blue-500', lightBg: 'bg-blue-50' },
  { id: 'needs_approval', title: 'צריך אישור', color: 'bg-amber-500', lightBg: 'bg-amber-50' },
  { id: 'done', title: 'הושלם', color: 'bg-green-500', lightBg: 'bg-green-50' },
]

export default function Board({ tasks, onMove, onAdd, onUpdate, onDelete }) {
  const handleDragEnd = (result) => {
    const { draggableId, destination } = result
    if (!destination) return

    const newStatus = destination.droppableId
    const task = tasks.find((t) => t.id === draggableId)
    if (!task || task.status === newStatus) return

    onMove(draggableId, newStatus)
  }

  const getColumnTasks = (status) =>
    tasks.filter((t) => t.status === status)

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-4 gap-4 p-6 max-w-7xl mx-auto">
        {COLUMNS.map((col) => {
          const columnTasks = getColumnTasks(col.id)
          return (
            <div key={col.id} className={`rounded-2xl ${col.lightBg} p-3 min-h-[70vh]`}>
              <div className="flex items-center gap-2 mb-4 px-1">
                <div className={`w-3 h-3 rounded-full ${col.color}`} />
                <h2 className="font-semibold text-gray-700 text-sm">{col.title}</h2>
                <span className="mr-auto text-xs text-gray-400 bg-white px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-2 min-h-[50px] rounded-xl transition-colors p-1 ${
                      snapshot.isDraggingOver ? 'bg-blue-100/50' : ''
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <TaskCard
                              task={task}
                              onUpdate={onUpdate}
                              onDelete={onDelete}
                              dragHandleProps={provided.dragHandleProps}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {col.id === 'todo' && (
                <div className="mt-3">
                  <AddTask onAdd={onAdd} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
