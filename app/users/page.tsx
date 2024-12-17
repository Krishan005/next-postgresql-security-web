"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { getUsers } from "../slices/getUsers";
import { addUser } from "../slices/addUsers";
import { updateUser } from "../slices/editUser";
import { getUserFromSessionStorage } from "../slices/getUserDetails";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserList = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loadingData, setLoadingData] = useState(true);
  const [users, setUsers] = useState<any[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let userDetails: any = {};
  if (typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
    userDetails = JSON.parse(
      window.atob(String(sessionStorage.getItem("user")))
    );
  }
  const roleID = userDetails?.role;

  console.log("User Details:", userDetails);
  console.log("Role ID:", roleID);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: 0,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { userList, newUserList, userLoading, userError } = useAppSelector(
    (state) => state.users
  );

  const { user, addUserLoading, addUserError } = useAppSelector(
    (state) => state.addUser
  );

  const { userUpdate, status } = useAppSelector((state) => state.editUser);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (userList) {
      const newData: any = userList;
      setUsers(newUserList);
      setLoadingData(false);
    }
  }, [userList, addUserLoading, user, userUpdate]);

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (showEditModal) {
      setSelectedUser((prevState: any) => ({ ...prevState, [name]: value }));
    } else {
      setNewUser((prevState) => ({ ...prevState, [name]: value }));
    }
  };
  const handleAddUser = async () => {
    if (
      !newUser.name ||
      !newUser.email ||
      !newUser.password ||
      !newUser.phone
    ) {
      Swal.fire("Error", "Please fill out all fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(addUser(newUser));
      Swal.fire("Success", "User added successfully!", "success");
      setShowAddModal(false);
      dispatch(getUsers());
    } catch (error) {
      Swal.fire("Error", "Failed to add user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser.name || !selectedUser.email || !selectedUser.phone) {
      Swal.fire("Error", "Please fill out all fields", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(updateUser(selectedUser));
      Swal.fire("Success", "User updated successfully!", "success");
      setShowEditModal(false);
      dispatch(getUsers());
    } catch (error) {
      Swal.fire("Error", "Failed to update user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100">
        <Navbar name={"User List"} />
        <main className="p-6">
          <h1 className="text-2xl font-semibold">User List</h1>
          <p className="mt-4">Manage and view all registered users here.</p>

          {/* Add User Button */}
          {roleID === 2 && (
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={() => setShowAddModal(true)}
              >
                Add New User
              </button>
            </div>
          )}

          {/* Add/Edit/View User Modals */}
          {(showAddModal || showEditModal || showViewModal) && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">
                  {showViewModal
                    ? "View User"
                    : showEditModal
                    ? "Edit User"
                    : "Add New User"}
                </h2>

                {showViewModal ? (
                  <div>
                    <p>
                      <strong>Name:</strong> {selectedUser?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedUser?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedUser?.phone}
                    </p>
                    <p>
                      <strong>Role:</strong>{" "}
                      {selectedUser?.role === 2
                        ? "Admin"
                        : selectedUser?.role === 1
                        ? "Editor"
                        : "User"}
                    </p>
                  </div>
                ) : (
                  <form>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={showEditModal ? selectedUser.name : newUser.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={
                          showEditModal ? selectedUser.email : newUser.email
                        }
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={
                          showEditModal ? selectedUser.phone : newUser.phone
                        }
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded"
                      />
                    </div>

                    {showEditModal ? null : (
                      <>
                        <div className="mb-4 relative">
                          <label className="block text-sm font-medium text-gray-700">
                            Password
                          </label>
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={newUser.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                          />
                          <span
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>

                        <div className="mb-4 relative">
                          <label className="block text-sm font-medium text-gray-700">
                            Confirm Password
                          </label>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={newUser.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded"
                          />
                          <span
                            className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <select
                        name="role"
                        value={showEditModal ? selectedUser.role : newUser.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded"
                      >
                        <option value={0}>User</option>
                        <option value={1}>Editor</option>
                        <option value={2}>Admin</option>
                      </select>
                    </div>
                  </form>
                )}

                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => {
                      if (showEditModal) setShowEditModal(false);
                      if (showAddModal) setShowAddModal(false);
                      if (showViewModal) setShowViewModal(false);
                    }}
                  >
                    Close
                  </button>
                  {!showViewModal && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={showEditModal ? handleEditUser : handleAddUser}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      ) : null}
                      {showEditModal ? "Update User" : "Add User"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Existing Users Table */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Existing Users</h2>
            <div className="overflow-x-auto mt-4 border border-gray-300 rounded-lg shadow-md">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                      User Name
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                      Role
                    </th>
                    <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
              </table>
              <div
                className="max-h-80 overflow-y-scroll"
                style={{ height: "300px" }}
              >
                <table className="min-w-full">
                  <tbody>
                    {users?.length > 0 ? (
                      users?.map((user: any, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100`}
                        >
                          <td className="px-4 py-2 border-b text-sm text-gray-800">
                            {user.name}
                          </td>
                          <td className="px-4 py-2 border-b text-sm text-gray-800">
                            {user.email}
                          </td>
                          <td className="px-4 py-2 border-b text-sm text-gray-800">
                            {user.role === 2
                              ? "Admin"
                              : user.role === 1
                              ? "Editor"
                              : user.role === 0
                              ? "User"
                              : "Unknown"}
                          </td>
                          <td className="px-4 py-2 border-b text-sm text-gray-800 space-x-2">
                            <button
                              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                              onClick={() => handleViewUser(user)}
                            >
                              View
                            </button>
                            {roleID == 2 ? (
                              <button
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                onClick={() => openEditModal(user)}
                              >
                                Edit
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-4 py-2 text-center text-gray-500"
                        >
                          No users available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {loadingData && (
            <div className="mt-6 text-center text-gray-600">
              Loading users...
            </div>
          )}

          {userError && (
            <div className="mt-6 text-center text-red-500">
              Failed to load users. Please try again.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserList;
