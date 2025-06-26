"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import taskApi from "@/utils/__api__/tasks";
import { toast } from "sonner";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  status: z.enum(["todo", "in_progress", "done"], "Invalid status"),
  priority: z.enum(["low", "medium", "high"], "Invalid priority"),
  assigneeId: z.number().min(1, "Assignee is required"),
  due_date: z.string().min(1, "Due date is required"),
});

export default function UpdateTaskForm({ task, isOpen, onClose, onUpdate }) {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      status: task.status,
      priority: task.priority,
      assigneeId: task.assignee?.id || 0,
      due_date: task.due_date,
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const userData = await taskApi.getUserForTask();
        setUsers(userData);
      } catch (error) {
        toast.error("Failed to load users");
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isOpen) fetchUsers();
  }, [isOpen]);

  const onSubmit = async (formData) => {
    try {
      const updateData = {
        ...formData,
        assigneeId: Number(formData.assigneeId), // Explicit conversion
        id: task.id, // Ensure task ID is included
      };

      await onUpdate(updateData);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to update task");
    }
  };

  const selectedDate = watch("due_date");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Update Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              {...register("title")}
              className="w-full"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              onValueChange={(value) => setValue("status", value)}
              defaultValue={task.status}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-red-500 text-sm">{errors.status.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              onValueChange={(value) => setValue("priority", value)}
              defaultValue={task.priority}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-red-500 text-sm">{errors.priority.message}</p>
            )}
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label>Assignee</Label>
            {loadingUsers ? (
              <Input
                disabled
                className="w-full"
                placeholder="Loading users..."
              />
            ) : (
              <Select
                onValueChange={(value) => setValue("assigneeId", Number(value))}
                defaultValue={String(task.assignee?.id || "")}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={String(user.id)}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.assigneeId && (
              <p className="text-red-500 text-sm">
                {errors.assigneeId.message}
              </p>
            )}
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(new Date(selectedDate), "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate ? new Date(selectedDate) : undefined}
                  onSelect={(date) =>
                    setValue("due_date", format(date, "yyyy-MM-dd"))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.due_date && (
              <p className="text-red-500 text-sm">{errors.due_date.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
