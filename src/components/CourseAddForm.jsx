import React from "react";
import { useDispatch } from "react-redux";
import CourseCreateForm from "../components/CourseCreateForm.jsx";
import {createCourse} from "../store/courseSlice.js"

const CourseAddForm = () => {
  const dispatch = useDispatch();

const handleCreateCourse = async (formData) => {
  try {
    console.log("Creating course with data:", formData);
    await dispatch(createCourse(formData)).unwrap();
    console.log("✅ Course created successfully!");
  } catch (err) {
    console.error("❌ Course creation failed:", err);
  }
};

  return (
    <div className="p-6">
      <CourseCreateForm onSubmit={handleCreateCourse} />
    </div>
  );
};

export default CourseAddForm;
