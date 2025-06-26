"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, FolderPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import projectApi from "@/utils/__api__/projects";

// validation schema
const addProjectSchema = z.object({
  name: z
    .string()
    .min(6, "Project Name is required & should be atleast 6 characters"),
  description: z
    .string()
    .min(10, "Description is required & should be atleast 10 character"),
});

export default function AddProjectForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(addProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const submitHandler = async (data) => {
    try {
      const response = await projectApi.createProject(data);

      if (response) {
        toast.success("Project created successfully!");
        reset(); // Clear the form
        router.push("/admin/projects");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create project");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FolderPlus className="h-6 w-6" />
        Add New Project
      </h1>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <div>
          <Label htmlFor="name" className="my-2">
            Project Name
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="DevProFlow V1"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="description" className="my-2">
            Description
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            placeholder="A task and project management system."
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Plus className="h-4 w-4 animate-spin mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Project
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
