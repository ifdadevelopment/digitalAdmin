import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { selectTotalUsers } from "../store/userSlice";
import { selectTotalEnrolledCourses } from "../store/courseStudentSlice";
import { selectTotalCourses } from "../store/courseSlice";
import { selectAllPaymentsCount } from "../store/paymentSlice";

const Home = () => {
  const totalCourses = useSelector(selectTotalCourses);
  const totalEnrolledCourses = useSelector(selectTotalEnrolledCourses);
  const totalUsers = useSelector(selectTotalUsers);
  const totalPayments = useSelector(selectAllPaymentsCount);

  const [chartType, setChartType] = useState("Bar");

  // Metrics data - used for both cards and chart
  const metricsData = [
    {
      name: "Courses",
      value: totalCourses ?? 0,
      color: "#3b82f6",
    },
    {
      name: "Tests",
      value: totalEnrolledCourses ?? 0,
      color: "#10b981",
    },
    {
      
      name: "Payments",
      value: totalPayments ?? 0,
      color: "#f59e0b",
    },
    {
      name: "Students",
      value: totalUsers ?? 0,
      color: "#ef4444",
    },
  ];

  // Render chart based on selection
  const renderChart = () => {
    if (!metricsData.length) {
      return (
        <div className="text-center text-gray-500 mt-10">
          No data available
        </div>
      );
    }

    switch (chartType) {
      case "Bar":
        return (
          <BarChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value">
              {metricsData.map((entry, index) => (
                <Cell key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        );

      case "Line":
        return (
          <LineChart data={metricsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              isAnimationActive
            />
          </LineChart>
        );

      case "Pie":
      case "Donut":
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={metricsData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={chartType === "Donut" ? 40 : 0}
              outerRadius={80}
              label
            >
              {metricsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto font-nunito">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6 items-start sm:items-center">
        <div className="flex flex-wrap gap-3">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm text-sm"
          >
            {["Bar", "Line", "Pie", "Donut"].map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-primary">
          Platform Metrics
        </h1>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {metricsData.map((metric) => (
          <div
            key={metric.name}
            className="bg-white p-4 rounded-xl shadow text-center hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{metric.name}</p>
            <p className="text-xl font-bold" style={{ color: metric.color }}>
              {metric.value.toLocaleString()}
            </p>
          </div>
        ))} 
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition duration-300">
        <h2 className="text-lg font-semibold mb-2 text-gray-700">
          {chartType} Chart - Metrics Overview
        </h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Home;
