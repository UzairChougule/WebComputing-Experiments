import { useState, useEffect, useCallback } from "react";

// --- Helper Functions for localStorage Simulation ---
// ... (Your helper functions remain the same)
const getUsers = () => JSON.parse(localStorage.getItem("users") || "[]");
const setUsers = (users) => localStorage.setItem("users", JSON.stringify(users));
const getCurrentUser = () => JSON.parse(localStorage.getItem("currentUser"));
const setCurrentUser = (user) => {
    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
        localStorage.removeItem("currentUser");
    }
};
// --- End Helper Functions ---


// FIX: Read configuration from .env variables
const FIREBASE_CONFIG = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// You would initialize your real Firebase app here
// import { initializeApp } from "firebase/app";
// const app = initializeApp(FIREBASE_CONFIG);


// Simulated Firebase functions (replace with actual Firebase)
export const useFirebase = () => {
    const [user, setUser] = useState(null);
    const [polls, setPolls] = useState([]);

    useEffect(() => {
        // Simulate loading saved user session
        const savedUser = getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
        }
    }, []);

    const signUp = useCallback(async (email, password, userData) => {
        const users = getUsers();

        // Check if user already exists
        if (users.some(u => u.email === email)) {
            throw new Error("Email already in use.");
        }

        // Simulate user creation
        const newUser = {
            uid: Date.now().toString(),
            email,
            password, // Storing for simulation. Don't do this in production.
            ...userData,
        };

        users.push(newUser);
        setUsers(users); // Save the updated user list

        setCurrentUser(newUser); // Set as the currently logged-in user
        setUser(newUser);
        return newUser;
    }, []);

    const signIn = useCallback(async (email, password) => {
        const users = getUsers();

        // Find the user by email
        const user = users.find(u => u.email === email);

        // Validate credentials
        if (user && user.password === password) {
            setCurrentUser(user); // Set as the currently logged-in user
            setUser(user);
            return user;
        }

        throw new Error("Invalid email or password");
    }, []);

    // ... (The rest of the useFirebase.js file is unchanged) ...
    const signOut = useCallback(async () => {
        setCurrentUser(null); // Clear the current user session
        setUser(null);
    }, []);

    const loadPolls = useCallback((department) => {
        const allPolls = JSON.parse(localStorage.getItem("polls") || "[]");
        const filtered = allPolls.filter((p) => p.department === department);
        setPolls(filtered);
    }, []);

    const createPoll = useCallback(async (pollData) => {
        const newPoll = {
            id: Date.now().toString(),
            ...pollData,
            createdAt: new Date().toISOString(),
            votes: {},
            voters: [],
        };

        const currentPolls = JSON.parse(localStorage.getItem("polls") || "[]");
        currentPolls.push(newPoll);
        localStorage.setItem("polls", JSON.stringify(currentPolls));

        loadPolls(pollData.department);
        return newPoll;
    }, [loadPolls]);

    const votePoll = useCallback(async (pollId, optionIndex, studentInfo) => {
        const allPolls = JSON.parse(localStorage.getItem("polls") || "[]");
        const pollIndex = allPolls.findIndex((p) => p.id === pollId);

        if (pollIndex !== -1) {
            const poll = allPolls[pollIndex];

            if (poll.voters?.some((v) => v.rollNo === studentInfo.rollNo)) {
                throw new Error("You have already voted on this poll");
            }

            if (!poll.votes) poll.votes = {};
            poll.votes[optionIndex] = (poll.votes[optionIndex] || 0) + 1;

            if (!poll.voters) poll.voters = [];

            const votedOptionText = poll.options[optionIndex];

            poll.voters.push({
                ...studentInfo,
                votedOptionIndex: optionIndex,
                votedOptionText: votedOptionText
            });

            allPolls[pollIndex] = poll;
            localStorage.setItem("polls", JSON.stringify(allPolls));
            loadPolls(poll.department);
        }
    }, [loadPolls]);

    const deletePoll = useCallback(async (pollId) => {
        const allPolls = JSON.parse(localStorage.getItem("polls") || "[]");
        const pollToDelete = allPolls.find(p => p.id === pollId);
        const department = pollToDelete?.department;

        const filtered = allPolls.filter((p) => p.id !== pollId);
        localStorage.setItem("polls", JSON.stringify(filtered));

        if (department) {
            loadPolls(department);
        } else if (user) {
            loadPolls(user.department);
        } else {
            setPolls(filtered);
        }
    }, [user, loadPolls]);

    return {
        user,
        polls,
        signUp,
        signIn,
        signOut,
        createPoll,
        loadPolls,
        votePoll,
        deletePoll,
    };
};
