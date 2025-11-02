import React, { useState } from "react";
import { LogOut, Plus, Trash2, Users, Clock, BarChart3 } from "lucide-react";
import { PollResults } from "./PollResults";

export const TeacherDashboard = ({ firebase, onSignOut }) => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: "",
    options: ["", ""],
  });
  const [selectedPoll, setSelectedPoll] = useState(null);

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!newPoll.question || newPoll.options.some((opt) => opt === "")) {
      alert("Please fill in the question and all options.");
      return;
    }
    await firebase.createPoll({
      ...newPoll,
      teacherId: firebase.user.uid,
      teacherName: firebase.user.name,
      department: firebase.user.department,
      status: "active",
    });
    setNewPoll({ question: "", options: ["", ""] });
    setShowCreatePoll(false);
  };

  const getPollResults = (poll) => {
    const total = Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);
    return poll.options.map((option, idx) => ({
      name: option,
      votes: poll.votes?.[idx] || 0,
      percentage:
        total > 0 ? (((poll.votes?.[idx] || 0) / total) * 100).toFixed(1) : 0,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Teacher Dashboard
            </h1>
            <p className="text-sm text-gray-600">{firebase.user.department}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">{firebase.user.name}</p>
              <p className="text-sm text-gray-600">{firebase.user.email}</p>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowCreatePoll(!showCreatePoll)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Poll
          </button>
        </div>

        {showCreatePoll && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Create New Poll</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your question"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={newPoll.question}
                onChange={(e) =>
                  setNewPoll({ ...newPoll, question: e.target.value })
                }
              />

              {newPoll.options.map((option, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Option ${idx + 1}`}
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    value={option}
                    onChange={(e) => {
                      const opts = [...newPoll.options];
                      opts[idx] = e.target.value;
                      setNewPoll({ ...newPoll, options: opts });
                    }}
                  />
                  {newPoll.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        const opts = newPoll.options.filter(
                          (_, i) => i !== idx
                        );
                        setNewPoll({ ...newPoll, options: opts });
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  setNewPoll({
                    ...newPoll,
                    options: [...newPoll.options, ""],
                  })
                }
                className="text-indigo-600 font-medium hover:text-indigo-700"
              >
                + Add Option
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleCreatePoll}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Create Poll
                </button>
                <button
                  onClick={() => setShowCreatePoll(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {firebase.polls.map((poll) => {
            const results = getPollResults(poll);
            const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

            return (
              <div
                key={poll.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {poll.question}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(poll.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setSelectedPoll(
                            selectedPoll?.id === poll.id ? null : poll
                          )
                        }
                        className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition"
                      >
                        <Users className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => firebase.deletePoll(poll.id)}
                        className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <PollResults results={results} totalVotes={totalVotes} />
                </div>

                {selectedPoll?.id === poll.id && poll.voters?.length > 0 && (
                  <div className="bg-gray-50 p-6 border-t">
                    <h4 className="font-bold text-gray-800 mb-4">
                      Students Who Voted ({poll.voters.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {poll.voters.map((voter, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-lg border border-gray-200"
                        >
                          <p className="font-medium text-gray-900 truncate">
                            {voter.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {voter.rollNo}
                          </p>
                          <p className="text-sm text-indigo-600 font-medium truncate mt-1">
                            {voter.votedOptionText || "N/A"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {firebase.polls.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No polls created yet. Create your first poll to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
