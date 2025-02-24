'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, MoreVertical, Calendar, Clock } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  case?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: 1,
        title: 'Review Contract Draft',
        description: 'Initial review of the licensing agreement',
        priority: 'high',
        dueDate: '2024-04-01',
        assignee: {
          name: 'John Doe',
          avatar: '/images/avatars/avatar-1.png'
        },
        case: 'Tech Corp Contract Review'
      },
      {
        id: 2,
        title: 'Prepare Court Documents',
        description: 'Draft motion for summary judgment',
        priority: 'medium',
        dueDate: '2024-04-03',
        assignee: {
          name: 'Sarah Smith',
          avatar: '/images/avatars/avatar-2.png'
        },
        case: 'Smith vs. Johnson'
      }
    ]
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [
      {
        id: 3,
        title: 'Client Meeting Notes',
        description: 'Summarize discussion points from client meeting',
        priority: 'medium',
        dueDate: '2024-03-30',
        assignee: {
          name: 'Jane Wilson',
          avatar: '/images/avatars/avatar-3.png'
        },
        case: 'Estate Planning - Brown Family'
      }
    ]
  },
  {
    id: 'review',
    title: 'Review',
    tasks: []
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: 4,
        title: 'File Court Response',
        description: 'Submit response to motion to dismiss',
        priority: 'high',
        dueDate: '2024-03-28',
        assignee: {
          name: 'John Doe',
          avatar: '/images/avatars/avatar-1.png'
        },
        case: 'Smith vs. Johnson'
      }
    ]
  }
];

export function TaskBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Task Board</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{column.title}</h3>
              <Badge variant="secondary">{column.tasks.length}</Badge>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-3 pr-4">
                {column.tasks.map((task) => (
                  <Card key={task.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{task.title}</h4>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground">{task.description}</p>

                      {task.case && (
                        <Badge variant="outline" className="w-full justify-start">
                          {task.case}
                        </Badge>
                      )}

                      <div className="flex items-center justify-between">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {task.dueDate}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={task.assignee.avatar} />
                            <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {task.assignee.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}