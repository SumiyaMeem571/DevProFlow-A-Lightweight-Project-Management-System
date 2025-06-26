"use client";
import { useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phonenumber: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.string().min(1, "Role is required"),
  isActive: z.boolean(),
});

export default function UpdateUserForm({ user, isOpen, onClose, onUpdate }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        username: user.username,
        email: user.email,
        phonenumber: user.phonenumber,
        role: user.role,
        isActive: user.isActive,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    // Create a new object with the user's id and updated data
    const updatedUserData = {
      id: user.id, // Make sure to include the user ID
      ...data,
    };
    await onUpdate(updatedUserData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Name"
              placeholder="Enter name"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Input
              label="Username"
              placeholder="Enter username"
              {...register("username")}
            />
            {errors.username && (
              <p className="text-red-600 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div>
            <Input
              label="Email"
              placeholder="Enter email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              {...register("phonenumber")}
            />
            {errors.phonenumber && (
              <p className="text-red-600 text-sm">
                {errors.phonenumber.message}
              </p>
            )}
          </div>
          <div>
            <Input
              label="Role"
              placeholder="Enter role"
              {...register("role")}
            />
            {errors.role && (
              <p className="text-red-600 text-sm">{errors.role.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isActive" {...register("isActive")} />
            <label htmlFor="isActive" className="text-sm">
              Active
            </label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
