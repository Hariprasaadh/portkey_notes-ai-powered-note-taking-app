"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner"; // Using Sonner for toast notifications
import { deleteNoteAction } from "@/actions/notes";

// Props interface for the DeleteNoteButton component
type Props = {
  noteId: string; //
  deleteNoteLocally: (noteId: string) => void; 
};

/**
 * DeleteNoteButton Component
 * 
 * Renders a delete button that opens a confirmation dialog before deleting a note.
 * Handles both server-side deletion and local state updates.
 * 
 * @param noteId - The unique identifier of the note to delete
 * @param deleteNoteLocally - Callback function to update local state after deletion
 */
function DeleteNoteButton({ noteId, deleteNoteLocally }: Props) {
  const router = useRouter();
  
  // Get the current noteId from URL search params to check if we need to redirect
  const noteIdParam = useSearchParams().get("noteId") || "";

  // useTransition hook for handling async operations with loading state
  const [isPending, startTransition] = useTransition();

  /**
   * Handles the note deletion process
   * - Calls the server action to delete the note from database
   * - Updates local state to remove the note from UI
   * - Redirects to home page if the deleted note was currently being viewed
   * - Shows appropriate toast notifications for success/error states
   */
  const handleDeleteNote = () => {
    startTransition(async () => {

      const { errorMessage } = await deleteNoteAction(noteId);

      if (!errorMessage) {
        
        toast.success("Note deleted successfully!");

        deleteNoteLocally(noteId);

        // If the deleted note is currently being viewed, redirect to home page
        if (noteId === noteIdParam) {
          router.replace("/");
        }
      } else {
        toast.error("Error deleting note", {
          description: errorMessage,
        });
      }
    });
  };

  return (
    <AlertDialog>
      {/* Trigger button - appears on hover over the note item */}
      <AlertDialogTrigger asChild>
        <Button
          className="absolute right-2 top-1/2 size-7 -translate-y-1/2 p-0 opacity-0 group-hover/item:opacity-100 [&_svg]:size-3"
          variant="ghost"
          aria-label="Delete note" 
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>

      {/* Confirmation dialog content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this note?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your note
            from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Dialog action buttons */}
        <AlertDialogFooter>
          {/* Cancel button - closes dialog without action */}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          
          {/* Delete confirmation button */}
          <AlertDialogAction
            onClick={handleDeleteNote}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-24"
            disabled={isPending} // Disable button during deletion process
          >
            {/* Show loading spinner during deletion, otherwise show "Delete" text */}
            {isPending ? <Loader2 className="animate-spin" /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteNoteButton;