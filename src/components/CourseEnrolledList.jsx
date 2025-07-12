import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllCourseStudents,
  deleteCourseEnrollment,
  selectAllEnrolledCourses,
  selectCourseStudentStatus,
} from "../store/courseStudentSlice";
import { Pencil, Trash2 } from "lucide-react";

const PAGE_SIZE = 10;

const CourseEnrolledList = () => {
  const dispatch = useDispatch();
  const enrolledCourses = useSelector(selectAllEnrolledCourses);
  const status = useSelector(selectCourseStudentStatus);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllCourseStudents());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      await dispatch(deleteCourseEnrollment(id));
      dispatch(fetchAllCourseStudents());
    }
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for enrollment ID: ${id}`);
  };

  const paginatedData = enrolledCourses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const totalPages = Math.ceil(enrolledCourses.length / PAGE_SIZE);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Enrolled Courses List</h2>

      {status === "loading" ? (
        <p>Loading...</p>
      ) : enrolledCourses.length === 0 ? (
        <p>No enrolled courses found.</p>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full bg-white border border-gray-200 rounded-md">
              <thead className="bg-gray-100 text-sm font-medium text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Image</th>
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Total Hours</th>
                  <th className="px-4 py-2 border">Level</th>
                  <th className="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {paginatedData.map((enrollment, index) => {
                  const course = enrollment?.course;
                  if (!course) return null;

                  return (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-4 py-2 border">
                        <img
                          src={course.image || "/default-course.jpg"}
                          alt={course.title || "Untitled"}
                          className="w-14 h-14 object-cover rounded"
                        />
                      </td>
                      <td className="px-4 py-2 border">{course.title || "Untitled"}</td>
                      <td className="px-4 py-2 border">
                        {course.totalHours ? `${course.totalHours} hrs` : "N/A"}
                      </td>
                      <td className="px-4 py-2 border">{course.level || "N/A"}</td>
                      <td className="px-4 py-2 border text-center">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(enrollment._id)}
                            title="Edit"
                            className="hover:scale-105 transition-transform"
                          >
                            <Pencil className="w-5 h-5 text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(enrollment._id)}
                            title="Delete"
                            className="hover:scale-105 transition-transform"
                          >
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseEnrolledList;
