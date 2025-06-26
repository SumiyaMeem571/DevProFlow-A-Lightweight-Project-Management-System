"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import UpdateTaskForm from "./update-task/update-task-form";
import taskApi from "@/utils/__api__/tasks"; // Import your task API

export default function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const itemsPerPage = 5;

  // Fetch tasks from API
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskApi.getAllTasks();
      setTasks(data);
    } catch (error) {
      toast.error(error.message || "Failed to fetch tasks");
      console.error("Fetch tasks error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskUpdate = async (updatedTask) => {
    try {
      await taskApi.updateTask(updatedTask.id, updatedTask);
      toast.success("Task updated successfully");
      fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      toast.error(error.message || "Failed to update task");
      console.error("Update task error:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await taskApi.deleteTask(taskId);
        toast.success("Task deleted successfully");
        fetchTasks(); // Refresh the list
      } catch (error) {
        toast.error(error.message || "Failed to delete task");
        console.error("Delete task error:", error);
      }
    }
  };

  const totalPages = Math.ceil(tasks.length / itemsPerPage);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Tasks</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => router.push("/manager/tasks/add-task")}
        >
          <Plus className="h-4 w-4" /> Add New Task
        </Button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell className="capitalize">
                    {task.status.replace("_", " ")}
                  </TableCell>
                  <TableCell className="capitalize">{task.priority}</TableCell>
                  <TableCell>
                    {new Date(task.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{task.project?.name || "N/A"}</TableCell>
                  <TableCell>
                    {task.assignee?.username || "Unassigned"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="outline"
                      className="mr-2 rounded-full"
                      onClick={() => setSelectedTask(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="mt-6 flex justify-end">
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && handlePageChange(currentPage - 1)
                      }
                      href="#"
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        handlePageChange(currentPage + 1)
                      }
                      href="#"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </>
      )}

      {/* Update Task Dialog */}
      {selectedTask && (
        <UpdateTaskForm
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}
