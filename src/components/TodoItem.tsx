"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(todo.id, editText.trim());
      setIsEditing(false);
    } else {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleDoubleClick = () => {
    if (!todo.completed) {
      setIsEditing(true);
    }
  };

  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={() => onToggle(todo.id)}
          className="flex-shrink-0"
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="flex-1"
                autoFocus
                aria-label="Edit todo text"
              />
              <Button
                size="sm"
                onClick={handleSave}
                className="px-3"
                aria-label="Save changes"
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="px-3"
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "cursor-pointer select-none break-words",
                todo.completed && "line-through text-muted-foreground"
              )}
              onDoubleClick={handleDoubleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleDoubleClick();
                }
              }}
              aria-label={`Todo: ${todo.text}. Double-click to edit.`}
            >
              {todo.text}
            </div>
          )}
        </div>

        {!isEditing && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(todo.id)}
            className="flex-shrink-0 px-3"
            aria-label={`Delete "${todo.text}"`}
          >
            Delete
          </Button>
        )}
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground">
        Created: {new Date(todo.createdAt).toLocaleDateString()}
        {todo.updatedAt !== todo.createdAt && (
          <span className="ml-2">
            Updated: {new Date(todo.updatedAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </Card>
  );
}