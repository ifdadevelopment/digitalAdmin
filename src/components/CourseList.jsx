import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [typeFilter, setTypeFilter] = useState("Student");
  const [loading, setLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/courses?type=${typeFilter}`);
      setCourses(data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`/api/courses/${courseId}`);
      fetchCourses();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleEdit = (courseId) => {
    console.log("Edit course:", courseId);
  };

  useEffect(() => {
    fetchCourses();
  }, [typeFilter]);

  return (
    <div className="p-6">
      <h2 className="text-2xl text-primary font-semibold mb-4">Courses ({typeFilter})</h2>

      <div className="mb-4">
        <select
          className="border rounded px-3 py-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="Student">Student</option>
          <option value="Business">Business</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border rounded-lg">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Title</th>
              {typeFilter === "Student" ? (
                <>
                  <th className="px-4 py-2 border">Price</th>
                  <th className="px-4 py-2 border">Sale Price</th>
                </>
              ) : (
                <th className="px-4 py-2 border">Category</th>
              )}
              <th className="px-4 py-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="text-center py-4" colSpan={typeFilter === "Student" ? 6 : 5}>
                  Loading...
                </td>
              </tr>
            ) : courses.length === 0 ? (
              <tr>
                <td className="text-center py-4" colSpan={typeFilter === "Student" ? 6 : 5}>
                  No courses found.
                </td>
              </tr>
            ) : (
              courses.map((course, index) => (
                <tr key={course.courseId} className="text-sm border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">
                    <img
                      src={course.thumbnail || "/placeholder.png"}
                      alt={course.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border">{course.title}</td>

                  {typeFilter === "Student" ? (
                    <>
                      <td className="px-4 py-2 border">₹{course.price || "-"}</td>
                      <td className="px-4 py-2 border">₹{course.salePrice || "-"}</td>
                    </>
                  ) : (
                    <td className="px-4 py-2 border">{course.category || "-"}</td>
                  )}

                  <td className="px-4 py-2 border text-center flex items-center justify-center gap-4">
                    <button onClick={() => handleEdit(course.courseId)} title="Edit">
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => handleDelete(course.courseId)} title="Delete">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseList;
