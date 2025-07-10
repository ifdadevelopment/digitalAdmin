import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const CourseEditForm = ({ initialData = {}, onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...initialData,
      whatYouWillLearn: (initialData.whatYouWillLearn || []).join(", "),
      topics: (initialData.topics || []).join(", "),
      includes: (initialData.includes || []).join(", "),
      requirements: (initialData.requirements || []).join(", "),
    },
  });

  const type = watch("type");
  const [typeSelected, setTypeSelected] = useState(!!initialData.type);

  const [videoPreview, setVideoPreview] = useState(initialData.previewVideo || null);
  const [videoFile, setVideoFile] = useState(null);

  const [brochureFile, setBrochureFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (type) {
      setTypeSelected(true);
    }
  }, [type]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrochureFile(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

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
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    if (videoFile) formData.append("previewVideo", videoFile);
    if (brochureFile) formData.append("downloadBrochure", brochureFile);
    if (imageFile) formData.append("image", imageFile);

    return formData;
  };

  return (
    <div className="max-w-5xl mx-auto p-10 bg-white shadow-xl rounded-2xl border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">✏️ Edit Course</h2>

      <form onSubmit={handleSubmit((data) => onSubmit(preparePayload(data)))} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Course Type</label>
          <select
            {...register("type", { required: true })}
            className="w-full border border-primary px-3 py-2 rounded-md"
          >
            <option value="">Select type</option>
            <option value="Student">Student</option>
            <option value="Business">Business</option>
          </select>
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
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Course Image</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="w-full border border-primary px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <input
                {...register("category")}
                className="w-full border border-primary px-3 py-2 rounded-md"
              />
            </div>

            {type === "Student" && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Preview Video</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="w-full border border-primary px-3 py-2 rounded-md"
                  />
                  {videoPreview && (
                    <video src={videoPreview} controls className="mt-2 w-full rounded-md border" />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    What You Will Learn
                  </label>
                  <input
                    {...register("whatYouWillLearn")}
                    className="w-full border border-primary px-3 py-2 rounded-md"
                    placeholder="Comma-separated"
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Requirements</label>
                  <input
                    {...register("requirements")}
                    className="w-full border border-primary px-3 py-2 rounded-md"
                  />
                </div>
              </>
            )}

            {type === "Business" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Brochure (PDF)</label>
                <input
                  type="file"
                  onChange={handleBrochureChange}
                  className="w-full border border-primary px-3 py-2 rounded-md"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Includes</label>
              <input
                {...register("includes")}
                className="w-full border border-primary px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                {...register("description")}
                rows={5}
                className="w-full border border-primary px-3 py-2 rounded-md"
              />
            </div>

            <div>
              <button
                type="submit"
                className="bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md"
              >
                💾 Save Changes
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CourseEditForm;
