"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash, Plus, User } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import UpdateProjectForm from "./update-project/update-project-form";
import projectApi from "@/utils/__api__/projects";

export default function ManageProject() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const itemsPerPage = 5;

  const fetchProjects = async () => {
    setLoading(true);
    try {
      setProjects(await projectApi.getAllProjects());
    } catch (error) {
      toast.error(error.message || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectUpdate = async (updatedProject) => {
    try {
      await projectApi.updateProject(updatedProject.id, updatedProject);
      toast.success("Project updated successfully");
      fetchProjects();
      setSelectedProject(null);
    } catch (error) {
      toast.error(error.message || "Failed to update project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await projectApi.deleteProject(projectId);
        toast.success("Project deleted successfully");
        fetchProjects();
      } catch (error) {
        toast.error(error.message || "Failed to delete project");
      }
    }
  };

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <Button
          onClick={() => router.push("/admin/projects/add-project")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add New
        </Button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {project.created_by?.username || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(project.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(project.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="outline"
                      className="mr-2 rounded-full"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        currentPage > 1 && setCurrentPage(currentPage - 1)
                      }
                      href="#"
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        currentPage < totalPages &&
                        setCurrentPage(currentPage + 1)
                      }
                      href="#"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {selectedProject && (
        <UpdateProjectForm
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onUpdate={handleProjectUpdate}
        />
      )}
    </div>
  );
}
