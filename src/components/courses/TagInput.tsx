
import React, { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
  onTagAdded?: (tag: string) => void;
  onTagRemoved?: (tag: string) => void;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = "Add a tag...",
  maxTags = 10,
  onTagAdded,
  onTagRemoved,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    }
    
    // Remove last tag on Backspace if input is empty
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      const newTags = [...value];
      const removedTag = newTags.pop() as string;
      onChange(newTags);
      onTagRemoved?.(removedTag);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().replace(/,/g, "");
    
    if (!trimmedTag) return;
    
    // Check if tag already exists or we've reached the max
    if (value.includes(trimmedTag) || value.length >= maxTags) {
      setInputValue("");
      return;
    }
    
    const newTags = [...value, trimmedTag];
    onChange(newTags);
    onTagAdded?.(trimmedTag);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter((tag) => tag !== tagToRemove);
    onChange(newTags);
    onTagRemoved?.(tagToRemove);
  };

  return (
    <div className="flex flex-wrap items-center border rounded-md bg-kombee-background p-1.5 gap-1.5">
      {/* Render existing tags */}
      {value.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-1 py-1 px-2 rounded-full bg-primary/20 text-primary-foreground text-sm"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="text-primary-foreground hover:text-white focus:outline-none"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      
      {/* Input for new tags */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 bg-transparent border-none text-white placeholder-muted-foreground focus:outline-none focus:ring-0 text-sm min-w-[120px]"
      />
    </div>
  );
}
