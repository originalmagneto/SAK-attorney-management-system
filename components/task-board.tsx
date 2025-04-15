'use client';

import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  MoreVertical,
  Tag,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: {
    name: string;
    avatar: string;
  };
  labels: string[];
  createdAt: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Prepare Motion for Summary Judgment',
    description: 'Draft and file motion with supporting exhibits',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-04-15',
    assignedTo: {
      name: 'Jane Smith',
      avatar: '/images/avatars/avatar-1.png'
    },
    labels: ['Legal Motion', 'Urgent'],
    createdAt: '2024-03-27'
  },
  {
    id: '2',
    title: 'Review Discovery Documents',
    description: 'Analyze and categorize recent document production',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-04-10',
    assignedTo: {
      name: 'Mike Wilson',
      avatar: '/images/avatars/avatar-2.png'
    },
    labels: ['Discovery', 'Document Review'],
    createdAt: '2024-03-26'
  }
];

const columns = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

interface TaskBoardProps {
  caseId: string;
  tasks?: Task[];
  onTaskUpdate?: (task: Task) => void;
  onTaskCreate?: (task: Task) => void;
}

export function TaskBoard({
  caseId,
  tasks: initialTasks = mockTasks,
  onTaskUpdate,
  onTaskCreate
}: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    status: 'todo',
    priority: 'medium',
    labels: []
  });

  const handleTaskDragEnd = (task: Task, newStatus: string) => {
    const updatedTask = { ...task, status: newStatus as Task['status'] };
    const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
    setTasks(updatedTasks);
    onTaskUpdate?.(updatedTask);
  };

  const handleTaskCreate = () => {
    const task: Task = {
      ...newTask as Task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, task]);
    onTaskCreate?.(task);
    setIsNewTaskDialogOpen(false);
    setNewTask({
      status: 'todo',
      priority: 'medium',
      labels: []
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track case-related tasks
          </p>
        </div>
        <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add a new task to the board
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newTask.title || ''}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newTask.description || ''}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={newTask.dueDate || ''}
                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleTaskCreate}>Create Task</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map(column => (
          <Card key={column.id} className="p-4">
            <h3 className="font-medium mb-4 flex items-center justify-between">
              {column.title}
              <Badge variant="outline">
                {tasks.filter(task => task.status === column.id).length}
              </Badge>
            </h3>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {tasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={(newStatus) => handleTaskDragEnd(task, newStatus)}
                    />
                  ))}
              </div>
            </ScrollArea>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: string) => void;
}

function TaskCard({ task, onStatusChange }: TaskCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-lg border bg-card p-3 shadow-sm"
      draggable
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h4 className="font-medium line-clamp-2">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map(column => (
                <DropdownMenuItem
                  key={column.id}
                  onClick={() => onStatusChange(column.id)}
                >
                  Move to {column.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Delete Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {task.labels.map((label, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            {task.assignedTo && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={task.assignedTo.avatar} />
                <AvatarFallback>{task.assignedTo.name[0]}</AvatarFallback>
              </Avatar>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <Badge variant={
            task.priority === 'high' ? 'destructive' :
            task.priority === 'medium' ? 'default' :
            'secondary'
          }>
            {task.priority}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}