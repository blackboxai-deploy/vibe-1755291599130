"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface TodoFormProps {
  onAddTodo: (text: string) => void;
}

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;

    setIsSubmitting(true);
    
    try {
      onAddTodo(trimmedValue);
      setInputValue("");
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new todo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSubmitting}
            className="flex-1"
            maxLength={500}
            aria-label="New todo input"
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isSubmitting}
            className="px-4"
            aria-label="Add todo"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Todo</span>
          </Button>
        </form>
        {inputValue.length > 450 && (
          <p className="text-sm text-muted-foreground mt-2">
            {500 - inputValue.length} characters remaining
          </p>
        )}
      </CardContent>
    </Card>
  );
}