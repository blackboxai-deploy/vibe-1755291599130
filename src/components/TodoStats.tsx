import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Todo } from '@/types/todo';

interface TodoStatsProps {
  todos: Todo[];
  onClearCompleted: () => void;
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos, onClearCompleted }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionPercentage = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  if (totalTodos === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <p className="text-lg">No tasks yet</p>
            <p className="text-sm">Add your first todo to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-orange-600">{activeTodos}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-green-600">{completedTodos}</div>
              <div className="text-xs text-muted-foreground">Done</div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              {activeTodos} remaining
            </Badge>
            {completedTodos > 0 && (
              <Badge variant="secondary" className="text-xs">
                {completedTodos} completed
              </Badge>
            )}
          </div>

          {/* Clear Completed Button */}
          {completedTodos > 0 && (
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCompleted}
                className="w-full text-xs"
              >
                Clear {completedTodos} completed task{completedTodos !== 1 ? 's' : ''}
              </Button>
            </div>
          )}

          {/* Motivational Message */}
          {completionPercentage === 100 && totalTodos > 0 && (
            <div className="text-center pt-2 border-t">
              <div className="text-sm font-medium text-green-600">🎉 All tasks completed!</div>
              <div className="text-xs text-muted-foreground">Great job staying productive!</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};