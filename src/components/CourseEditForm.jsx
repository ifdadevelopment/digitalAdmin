import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchCourseById,
  editCourse,
  selectCourseStatus,
  selectSelectedCourse,
} from "../store/courseSlice";

const CourseEditForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const status = useSelector(selectCourseStatus);
  const course = useSelector(selectSelectedCourse);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const type = watch("type");

  const [videoPreview, setVideoPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [brochureFile, setBrochureFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
  }, [dispatch, courseId]);

  useEffect(() => {
    if (course) {
      reset({
        ...course,
        whatYouWillLearn: (course.whatYouWillLearn || []).join(", "),
        topics: (course.topics || []).join(", "),
        includes: (course.includes || []).join(", "),
        requirements: (course.requirements || []).join(", "),
      });
      setVideoPreview(course.previewVideo || null);
    }
  }, [course, reset]);

  const preparePayload = (data) => {
    const payload = {
      ...data,
      whatYouWillLearn: data.whatYouWillLearn?.split(",").map((s) => s.trim()) || [],
      topics: data.topics?.split(",").map((s) => s.trim()) || [],
      includes: data.includes?.split(",").map((s) => s.trim()) || [],
      requirements: data.requirements?.split(",").map((s) => s.trim()) || [],
    };

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
    });

    if (videoFile) formData.append("previewVideo", videoFile);
    if (brochureFile) formData.append("downloadBrochure", brochureFile);
    if (imageFile) formData.append("image", imageFile);

    return formData;
  };

  const onSubmit = async (data) => {
    try {
      const formData = preparePayload(data);
      await dispatch(editCourse({ courseId, formData })).unwrap();
      navigate("/admin/courses/list");
    } catch (err) {
      console.error("Failed to update course:", err);
    }
  };

  if (!course) return <div className="text-center py-10">Loading course data...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 sm:p-10 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">✏️ Edit Course ({course.title})</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {type && (
          <>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Title</label>
              <input
                {...register("title", { required: true })}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
                placeholder="Course Title"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Subtitle</label>
              <input
                {...register("subtitle")}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Course Image</label>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category</label>
              <input
                {...register("category")}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>
            {type === "Student" && (
              <>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Preview Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setVideoFile(file);
                      setVideoPreview(URL.createObjectURL(file));
                    }}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  />
                  {videoPreview && (
                    <video src={videoPreview} controls className="mt-3 w-full rounded-md border" />
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">What You Will Learn</label>
                  <input
                    {...register("whatYouWillLearn")}
                    placeholder="Comma-separated list"
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      {...register("price")}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Sale Price</label>
                    <input
                      type="number"
                      {...register("salePrice")}
                      className="w-full border border-gray-300 px-3 py-2 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Topics</label>
                  <input
                    {...register("topics")}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Requirements</label>
                  <input
                    {...register("requirements")}
                    className="w-full border border-gray-300 px-3 py-2 rounded-md"
                  />
                </div>
              </>
            )}
            {type === "Business" && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Brochure (PDF)</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setBrochureFile(e.target.files[0])}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md"
                />
              </div>
            )}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Includes</label>
              <input
                {...register("includes")}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                {...register("description")}
                rows={5}
                className="w-full border border-gray-300 px-3 py-2 rounded-md"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={status === "updating"}
                className={`bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md ${
                  status === "updating" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                💾 {status === "updating" ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CourseEditForm;
