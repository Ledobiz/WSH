'use client';

import { useState } from "react";
import { StickyNote, Plus, Trash2, Edit3, Check, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/src/providers/AuthProvider";

interface LessonNotesProps {
  notes: any[];
  courseId: string;
  lessonId: string;
  onAdd: (content: string) => void;
  onEdit: (noteId: string, content: string) => void;
  onDelete: (noteId: string) => void;
}

const LessonNotes = ({ notes, courseId, lessonId, onAdd, onEdit, onDelete }: LessonNotesProps) => {
  const { user } = useAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const lessonNotes = notes.filter((n) => n.courseId === courseId && n.studentModuleComponentId === lessonId);

  const handleAdd = () => {
    if (newContent.trim()) {
      onAdd(newContent.trim());
      setNewContent("");
      setIsAdding(false);
    }
  };

  const handleSaveEdit = (noteId: string) => {
    if (editContent.trim()) {
      onEdit(noteId, editContent.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <StickyNote className="h-4 w-4 text-accent" /> Notes
          {lessonNotes.length > 0 && (
            <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full font-bold">
              {lessonNotes.length}
            </span>
          )}
        </h3>
        {!isAdding && (
          <Button size="sm" variant="ghost" onClick={() => setIsAdding(true)} className="gap-1 text-xs h-8">
            <Plus className="h-3.5 w-3.5" /> Add Note
          </Button>
        )}
      </div>

      <div className="p-4 space-y-3">
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Write your note here..."
                className="min-h-[80px] text-sm mb-2"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAdd} className="gap-1 text-xs">
                  <Check className="h-3 w-3" /> Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false);
                    setNewContent("");
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {lessonNotes.length === 0 && !isAdding && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No notes for this lesson yet. Tap "Add Note" to start.
          </p>
        )}

        {lessonNotes.map((note) => (
          <motion.div
            key={note.id}
            layout
            className="bg-muted/50 rounded-xl p-3"
          >
            {editingId === note.id ? (
              <div>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[60px] text-sm mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveEdit(note.id)} className="gap-1 text-xs h-7">
                    <Check className="h-3 w-3" /> Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="text-xs h-7">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-foreground whitespace-pre-wrap mb-2">{note.note}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                  <div className="ml-auto flex gap-1">
                    <button
                      onClick={() => {
                        setEditingId(note.id);
                        setEditContent(note.note);
                      }}
                      className="p-1 rounded hover:bg-background transition-colors"
                    >
                      <Edit3 className="h-3 w-3 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onDelete(note.id)}
                      className="p-1 rounded hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LessonNotes;
