import React from "react";
import { LogOut, Users, CheckCircle, BarChart3 } from "lucide-react";
import { COLORS } from "../constants";

// FIX: Accept onSignOut prop
export const StudentDashboard = ({ firebase, onSignOut }) => {
  const handleVote = async (pollId, optionIndex) => {
    try {
      await firebase.votePoll(pollId, optionIndex, {
        rollNo: firebase.user.rollNo,
        name: firebase.user.name,
        department: firebase.user.department,
      });
    } catch (err) {
      alert(err.message);
    }
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Student Dashboard
            </h1>
            <p className="text-sm text-gray-600">
              {firebase.user.rollNo} • {firebase.user.department}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-gray-800">{firebase.user.name}</p>
              <p className="text-sm text-gray-600">{firebase.user.email}</p>
            </div>
            {/* FIX: Use onSignOut here */}
            <button
              onClick={onSignOut}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* ... rest of the component is unchanged ... */}

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid gap-6">
          {firebase.polls.map((poll) => {
            const hasVoted = poll.voters?.some(
              (v) => v.rollNo === firebase.user.rollNo
            );
            const results = getPollResults(poll);
            const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);

            return (
              <div
                key={poll.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">{poll.question}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span>Posted by {poll.teacherName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {!hasVoted ? (
                    <div className="space-y-3">
                      {poll.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleVote(poll.id, idx)}
                          className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition font-medium"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-green-600 mb-4">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">You have voted</span>
                      </div>

                      <div className="space-y-2">
                        {results.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-10 overflow-hidden">
                              <div
                                className="h-full flex items-center justify-between px-4 transition-all duration-500"
                                style={{
                                  width: `${result.percentage}%`,
                                  backgroundColor: COLORS[idx % COLORS.length],
                                }}
                              >
                                <span className="text-white font-medium">
                                  {result.name}
                                </span>
                                <span className="text-white font-medium">
                                  {result.votes}
                                </span>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-12 text-right">
                              {result.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {firebase.polls.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No active polls in your department yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
