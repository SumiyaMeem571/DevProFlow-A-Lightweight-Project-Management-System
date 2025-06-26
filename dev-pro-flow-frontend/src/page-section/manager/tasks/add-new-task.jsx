"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, ClipboardPlus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import taskApi from "@/utils/__api__/tasks";
import projectApi from "@/utils/__api__/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const addTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["todo", "in_progress", "done", "backlog"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  projectId: z.number().min(1, "Project is required"),
  assigneeId: z.number().min(1, "Assignee is required"),
  due_date: z.date({
    required_error: "Due date is required",
  }),
});

export default function AddTaskForm() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(addTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      projectId: undefined,
      assigneeId: undefined,
      due_date: new Date(),
    },
  });

  // Fetch projects and users
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsData, usersData] = await Promise.all([
          projectApi.getAllProjects(),
          taskApi.getUserForTask(),
        ]);
        setProjects(projectsData);
        setUsers(usersData);
      } catch (error) {
        toast.error("Failed to load form data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      // Prepare the data for API submission
      const taskData = {
        ...data,
        due_date: format(data.due_date, "yyyy-MM-dd"), // Format date for backend
      };

      const response = await taskApi.createTask(taskData);

      if (response) {
        toast.success("Task created successfully!");
        router.push("/manager/tasks");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create task");
      console.error("Task creation error:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardPlus className="h-5 w-5" />
          Add New Task
        </h1>
        <p className="text-sm text-muted-foreground">
          Fill out the form to create a new task
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading form data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Design landing page"
              className="w-full"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Create landing page UI for the new app"
              rows={3}
              className="w-full"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(value) => setValue("status", value)}
                defaultValue="todo"
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                onValueChange={(value) => setValue("priority", value)}
                defaultValue="medium"
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-sm text-red-500">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                onValueChange={(value) => setValue("projectId", Number(value))}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.projectId && (
                <p className="text-sm text-red-500">
                  {errors.projectId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select
                onValueChange={(value) => setValue("assigneeId", Number(value))}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assigneeId && (
                <p className="text-sm text-red-500">
                  {errors.assigneeId.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-10",
                    !watch("due_date") && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch("due_date") ? (
                    format(watch("due_date"), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch("due_date")}
                  onSelect={(date) => setValue("due_date", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.due_date && (
              <p className="text-sm text-red-500">{errors.due_date.message}</p>
            )}
          </div>

          <Button type="submit" className="mt-4" disabled={isSubmitting}>
            <Plus className="h-4 w-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </form>
      )}
    </div>
  );
}
