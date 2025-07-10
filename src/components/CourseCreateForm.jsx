import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CourseCreateForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      rating: 0,
      image: "",
      reviewsCount: 0,
      studentsEnrolled: 0,
      category: "",
      type: "",
      previewVideo: "",
      whatYouWillLearn: "",
      price: "",
      salePrice: "",
      topics: "",
      includes: "",
      requirements: "",
      description: "",
      downloadBrochure: "",
    },
  });

  const type = watch("type");
  const [typeSelected, setTypeSelected] = useState(false);

  useEffect(() => {
    if (type === "Business") {
      setValue("previewVideo", "");
      setValue("whatYouWillLearn", "");
      setValue("price", "");
      setValue("salePrice", "");
      setValue("topics", "");
      setValue("requirements", "");
    } else if (type === "Student") {
      setValue("downloadBrochure", "");
    }

    if (type) {
      setTypeSelected(true);
    }
  }, [type, setValue]);

  const preparePayload = (data) => {
    return {
      ...data,
      whatYouWillLearn: data.whatYouWillLearn?.split(",").map((s) => s.trim()) || [],
      topics: data.topics?.split(",").map((s) => s.trim()) || [],
      includes: data.includes?.split(",").map((s) => s.trim()) || [],
      requirements: data.requirements?.split(",").map((s) => s.trim()) || [],
    };
  };
const [videoPreview, setVideoPreview] = useState(null);

const handleVideoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setValue("previewVideo", file); 
    setVideoPreview(URL.createObjectURL(file)); 
  }
};
  return (
    <div className="max-w-5xl mx-auto p-10 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">📘 Create New Course</h2>

      <form onSubmit={handleSubmit((data) => onSubmit(preparePayload(data)))} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Course Type</label>
          <select
            {...register("type", { required: true })}
            className="w-full border border-primary px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            defaultValue=""
          >
            <option value="" disabled>
              Select type
            </option>
            <option value="Student">Student</option>
            <option value="Business">Business</option>
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">Course type is required</p>}
        </div>

        {typeSelected && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                {...register("title", { required: true })}
                className="w-full border border-primary px-3 py-2 rounded-md"
                placeholder="Course Title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
              <input
                {...register("subtitle")}
                className="w-full border border-primary px-3 py-2 rounded-md"
                placeholder="Course Subtitle"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Course Image</label>
              <input type="file" className="w-full border border-primary px-3 py-2 rounded-md" />
            </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <input
                  {...register("category")}
                  className="w-full border border-primary px-3 py-2 rounded-md"
                  placeholder="e.g. Development"
                />
            </div>
            {type === "Student" && (
              <>
             <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">
    Preview Video (upload)
  </label>
  <input
    type="file"
    accept="video/*"
    onChange={handleVideoChange}
    className="w-full border border-primary px-3 py-2 rounded-md"
  />
  {videoPreview && (
    <video
      src={videoPreview}
      controls
      className="mt-2 w-full rounded-md border"
    />
  )}
</div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    What You Will Learn
                  </label>
                  <input
                    {...register("whatYouWillLearn")}
                    className="w-full border border-primary px-3 py-2 rounded-md"
                    placeholder="Comma-separated list"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price</label>
                    <input
                      type="number"
                      {...register("price")}
                      className="w-full border border-primary px-3 py-2 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Sale Price</label>
                    <input
                      type="number"
                      {...register("salePrice")}
                      className="w-full border border-primary px-3 py-2 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Topics</label>
                  <input
                    {...register("topics")}
                    className="w-full border border-primary px-3 py-2 rounded-md"
                    placeholder="Comma-separated"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Requirements</label>
                  <input
                    {...register("requirements")}
                    className="w-full border border-primary px-3 py-2 rounded-md"
                    placeholder="Comma-separated"
                  />
                </div>
              </>
            )}
            {type === "Business" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Brochure (PDF)</label>
                <input type="file" className="w-full border border-primary px-3 py-2 rounded-md" />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Includes</label>
              <input
                {...register("includes")}
                className="w-full border border-primary px-3 py-2 rounded-md"
                placeholder="Comma-separated"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Course Description</label>
              <textarea
                {...register("description")}
                rows={5}
                className="w-full border border-primary px-3 py-2 rounded-md"
                placeholder="Write course details here..."
              />
            </div>
            <div>
              <button
                type="submit"
                className="bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition duration-150"
              >
                ➕ Create Course
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CourseCreateForm;
