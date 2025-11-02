import React, { useState, useEffect } from "react";
import { useFirebase } from "./hooks/useFirebase";
import { AuthForm } from "./components/AuthForm";
import { TeacherDashboard } from "./components/TeacherDashboard";
import { StudentDashboard } from "./components/StudentDashboard";

const App = () => {
  const firebase = useFirebase();
  const [authMode, setAuthMode] = useState("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department: "",
    rollNo: "",
  });
  const [error, setError] = useState("");

  // Load polls when user logs in
  useEffect(() => {
    if (firebase.user) {
      firebase.loadPolls(firebase.user.department);
    }
  }, [firebase.user, firebase.loadPolls]);

  // Set up an interval to refresh polls
  useEffect(() => {
    if (firebase.user) {
      const interval = setInterval(() => {
        firebase.loadPolls(firebase.user.department);
      }, 2000); // Refreshes every 2 seconds
      return () => clearInterval(interval);
    }
  }, [firebase.user, firebase.loadPolls]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (authMode === "signup") {
        if (
          !formData.name ||
          !formData.email ||
          !formData.password ||
          !formData.role ||
          !formData.department
        ) {
          setError("Please fill in all fields");
          return;
        }
        if (formData.role === "student" && !formData.rollNo) {
          setError("Please enter your roll number");
          return;
        }
        await firebase.signUp(formData.email, formData.password, {
          role: formData.role,
          department: formData.department,
          rollNo: formData.rollNo,
          name: formData.name,
        });
      } else {
        if (!formData.email || !formData.password) {
          setError("Please enter email and password");
          return;
        }
        await firebase.signIn(formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignOut = () => {
    firebase.signOut();
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      department: "",
      rollNo: "",
    });
    setAuthMode("signin");
    setError("");
  };

  // FIX: This function will clear bad data from localStorage
  const handleClearStorage = () => {
    if (
      window.confirm(
        "Are you sure? This will log you out and clear all saved users and polls. This is intended to fix login issues from previous versions."
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!firebase.user) {
    return (
      <AuthForm
        authMode={authMode}
        setAuthMode={setAuthMode}
        formData={formData}
        setFormData={setFormData}
        handleAuth={handleAuth}
        error={error}
        onClearStorage={handleClearStorage} // <-- Pass new function
      />
    );
  }

  return firebase.user.role === "teacher" ? (
    <TeacherDashboard firebase={firebase} onSignOut={handleSignOut} />
  ) : (
    <StudentDashboard firebase={firebase} onSignOut={handleSignOut} />
  );
};

export default App;
