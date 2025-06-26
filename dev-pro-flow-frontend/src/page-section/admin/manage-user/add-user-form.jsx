"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/utils/__api__/auth";

// Zod schema for validation
const addUserSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  phonenumber: z.string().regex(/^01[3-9]\d{8}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isActive: z.boolean(),
});

export default function AddUserForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const handleSwitchChange = (checked) => {
    setValue("isActive", checked);
  };

  const submitHandler = async (data) => {
    try {
      const response = await api.register(data);

      if (response) {
        toast.success("User registered successfully!");
        reset();
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Failed to register user");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <UserPlus className="h-6 w-6" />
        Add New User
      </h1>
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <div>
          <Label htmlFor="name" className="my-2">
            Full Name
          </Label>
          <Input id="name" {...register("name")} placeholder="Prantika meem" />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="username" className="my-2">
            Username
          </Label>
          <Input
            id="username"
            {...register("username")}
            placeholder="prantika123"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="email" className="my-2">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="prantika@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phonenumber" className="my-2">
            Phone Number
          </Label>
          <Input
            id="phonenumber"
            {...register("phonenumber")}
            placeholder="017xxxxxxxx"
          />
          {errors.phonenumber && (
            <p className="text-red-500 text-sm">{errors.phonenumber.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password" className="my-2">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Enter a secure password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Label htmlFor="isActive" className="my-2">
            Active
          </Label>
          <Switch
            id="isActive"
            defaultChecked
            onCheckedChange={handleSwitchChange}
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          <Plus className="h-4 w-4 mr-2" />
          {isSubmitting ? "Registering..." : "Add User"}
        </Button>
      </form>
    </div>
  );
}
