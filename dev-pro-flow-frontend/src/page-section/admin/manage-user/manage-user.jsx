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

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

import UpdateUserForm from "./update-user/update-user-form";
import userApi from "@/utils/__api__/users"; // Import the API methods
import { toast } from "sonner";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const itemsPerPage = 5;

  // Fetch users from the backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = async (updatedUser) => {
    try {
      await userApi.updateUser(updatedUser.id, updatedUser);
      fetchUsers();
      toast.success("User updated successfully");
      return true;
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Failed to update user:", error);
      return false;
    }
  };

  const handleDeleteClick = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userApi.deleteUser(userId);
        fetchUsers(); // Refresh the user list
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => router.push("/admin/add-user")}
        >
          <Plus className="h-4 w-4" />
          Add New
        </Button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phonenumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <span
                      className={
                        user.isActive
                          ? "text-green-600 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="outline"
                      className="mr-2 rounded-full"
                      onClick={() => handleEditClick(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="rounded-full"
                      onClick={() => handleDeleteClick(user.id)}
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

      {/* Update User Dialog */}
      {selectedUser && (
        <UpdateUserForm
          user={selectedUser}
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          onUpdate={handleUserUpdate}
        />
      )}
    </div>
  );
}
