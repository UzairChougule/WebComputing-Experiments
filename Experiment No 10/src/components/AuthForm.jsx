import React from "react";
import { BarChart3 } from "lucide-react";
import { DEPARTMENTS } from "../constants";

export const AuthForm = ({
  authMode,
  setAuthMode,
  formData,
  setFormData,
  handleAuth,
  error,
  onClearStorage, // <-- Receive new prop
}) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">ClassPoll</h1>
        <p className="text-gray-600 mt-2">Interactive Classroom Polling</p>
      </div>

      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setAuthMode("signin")}
          className={`flex-1 py-2 rounded-md font-medium transition ${
            authMode === "signin"
              ? "bg-white text-indigo-600 shadow"
              : "text-gray-600"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setAuthMode("signup")}
          className={`flex-1 py-2 rounded-md font-medium transition ${
            authMode === "signup"
              ? "bg-white text-indigo-600 shadow"
              : "text-gray-600"
          }`}
        >
          Sign Up
        </button>
      </div>

      <div className="space-y-4">
        {authMode === "signup" && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <select
              value={formData.role || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={formData.email || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password || ""}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />

        {authMode === "signup" && (
          <>
            <select
              value={formData.department || ""}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {formData.role === "student" && (
              <input
                type="text"
                placeholder="Roll Number (e.g., 23AI62)"
                value={formData.rollNo || ""}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rollNo: e.target.value.toUpperCase(),
                  })
                }
              />
            )}
          </>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleAuth}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          {authMode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </div>

      {/* FIX: New section for clearing storage */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Having trouble? (e.g., login not working)
        </p>
        <button
          onClick={onClearStorage}
          className="text-sm text-red-500 hover:text-red-700 font-medium"
        >
          Clear app data and refresh
        </button>
      </div>
    </div>
  </div>
);
