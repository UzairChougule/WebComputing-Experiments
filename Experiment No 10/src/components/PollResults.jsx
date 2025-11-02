import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { COLORS } from "../constants";

export const PollResults = ({ results, totalVotes }) => {
  const [chartType, setChartType] = useState("bar");

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setChartType("bar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            chartType === "bar"
              ? "bg-indigo-100 text-indigo-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Bar Chart
        </button>
        <button
          onClick={() => setChartType("pie")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            chartType === "pie"
              ? "bg-indigo-100 text-indigo-600"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          <PieChartIcon className="w-4 h-4" />
          Pie Chart
        </button>
      </div>

      {totalVotes > 0 ? (
        <div className="h-80">
          {chartType === "bar" ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes">
                  {results.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={results}
                  dataKey="votes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.percentage}%`}
                >
                  {results.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No votes yet. Share this poll with your students!
        </div>
      )}

      <div className="mt-6 space-y-2">
        {results.map((result, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
              <div
                className="h-full flex items-center justify-between px-3 transition-all duration-500"
                style={{
                  width: `${result.percentage}%`,
                  backgroundColor: COLORS[idx % COLORS.length],
                }}
              >
                <span className="text-white text-sm font-medium">
                  {result.name}
                </span>
                <span className="text-white text-sm font-medium">
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
  );
};
