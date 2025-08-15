"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type FilterType = "all" | "active" | "completed";

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export default function TodoFilter({ currentFilter, onFilterChange, counts }: TodoFilterProps) {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "active", label: "Active", count: counts.active },
    { key: "completed", label: "Completed", count: counts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={currentFilter === filter.key ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.key)}
          className="flex items-center gap-2"
        >
          {filter.label}
          <Badge 
            variant={currentFilter === filter.key ? "secondary" : "outline"}
            className="ml-1 text-xs"
          >
            {filter.count}
          </Badge>
        </Button>
      ))}
    </div>
  );
}