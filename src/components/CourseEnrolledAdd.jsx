import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCourseStudents,
  selectAllEnrolledCourses,
  selectCourseStudentStatus,
} from "../store/courseStudentSlice";

const contentTypes = ["video", "pdf", "image", "audio", "test"];

const CourseEnrolledAdd = () => {
  const dispatch = useDispatch();
  const enrolledCourses = useSelector(selectAllEnrolledCourses);
  const status = useSelector(selectCourseStudentStatus);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [formData, setFormData] = useState({
    badge: "",
    level: "",
    tags: "",
    modules: [],
    totalHours: 0,
    watchedHours: 0,
    assessments: 0,
    assignments: 0,
    questions: 0,
  });

  const [openModules, setOpenModules] = useState([]);
  const [openTopics, setOpenTopics] = useState({});

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAllCourseStudents());
    }
  }, [dispatch, status]);

  const calculateDurationsAndCounts = (modules) => {
    let total = 0;
    let watched = 0;
    let assessments = 0;
    let assignments = 0;

    modules.forEach((module) => {
      module.completed = true;
      module.topics.forEach((topic) => {
        topic.completed = true;
        topic.contents.forEach((content) => {
          const duration = parseFloat(content.duration) || 0;
          const isVideoOrAudio = ["video", "audio"].includes(content.type);
          const isPdfOrImage = ["pdf", "image"].includes(content.type);
          if (isVideoOrAudio) {
            total += duration;
            if (content.completed) watched += duration;
            else topic.completed = module.completed = false;
          } else if (isPdfOrImage) {
            if (!content.url || !content.pages)
              topic.completed = module.completed = false;
          }
          assessments += 1;

          if (Array.isArray(content.questions)) {
            assignments += content.questions.length;
          }
        });
      });
    });

    return {
      totalHours: parseFloat(total.toFixed(2)),
      watchedHours: parseFloat(watched.toFixed(2)),
      assessments,
      assignments,
    };
  };

  const updateAndSetModules = (updatedModules) => {
    const { totalHours, watchedHours, assessments, assignments } =
      calculateDurationsAndCounts(updatedModules);
    const totalQuestions = updatedModules.reduce(
      (acc, mod) =>
        acc +
        mod.topics.reduce(
          (a, t) =>
            a +
            t.contents.reduce(
              (c, cont) =>
                c + (Array.isArray(cont.questions) ? cont.questions.length : 0),
              0
            ),
          0
        ),
      0
    );

    setFormData((prev) => ({
      ...prev,
      modules: updatedModules,
      totalHours,
      watchedHours,
      assessments,
      assignments,
      questions: totalQuestions,
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleModule = (index) => {
    setOpenModules((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleTopic = (mIndex, tIndex) => {
    const key = `${mIndex}-${tIndex}`;
    setOpenTopics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddModule = () => {
    const newModules = [
      ...formData.modules,
      {
        moduleTitle: "",
        description: "",
        completed: false,
        topics: [],
      },
    ];
    updateAndSetModules(newModules);
  };

  const handleRemoveModule = (mIndex) => {
    const updated = formData.modules.filter((_, i) => i !== mIndex);
    updateAndSetModules(updated);
  };

  const handleAddTopic = (moduleIndex) => {
    const updated = [...formData.modules];
    updated[moduleIndex].topics.push({
      topicTitle: "",
      completed: false,
      contents: [],
    });
    updateAndSetModules(updated);
  };

  const handleRemoveTopic = (mIndex, tIndex) => {
    const updated = [...formData.modules];
    updated[mIndex].topics.splice(tIndex, 1);
    updateAndSetModules(updated);
  };

  const handleAddContent = (moduleIndex, topicIndex) => {
    const updated = [...formData.modules];
    updated[moduleIndex].topics[topicIndex].contents.push({
      type: "video",
      name: "",
      duration: "",
      pages: "",
      url: "",
      completed: false,
      questions: [],
    });
    updateAndSetModules(updated);
  };

  const handleRemoveContent = (mIndex, tIndex, cIndex) => {
    const updated = [...formData.modules];
    updated[mIndex].topics[tIndex].contents.splice(cIndex, 1);
    updateAndSetModules(updated);
  };

  const handleAddQuestion = (mIndex, tIndex, cIndex) => {
    const updated = [...formData.modules];
    const questions = updated[mIndex].topics[tIndex].contents[cIndex].questions;
    questions.push({
      question: "",
      options: ["", ""],
      answer: "",
      multiSelect: false,
    });
    updateAndSetModules(updated);
  };

  const handleCreateEnrollment = async () => {
    try {
      const payload = {
        courseId: selectedCourseId,
        badge: formData.badge,
        level: formData.level,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        totalHours: formData.totalHours,
        watchedHours: formData.watchedHours,
        modules: formData.modules,
        finalTest: {
          name: "",
          completed: false,
          score: 0,
          questions: [],
        },
      };

      const response = await axios.post("/api/course-student", payload);
      alert("Enrollment created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Create error:", error);
      alert("Failed to create enrollment.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create Course Enrollment</h2>

      <select
        className="border px-3 py-2 rounded w-full max-w-md mb-6"
        value={selectedCourseId}
        onChange={(e) => setSelectedCourseId(e.target.value)}
      >
        <option value="">🎓 Select a Student Course</option>
        {enrolledCourses.map((course) => (
          <option key={course.courseId} value={course.courseId}>
            {course.title}
          </option>
        ))}
      </select>

      {selectedCourseId && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              placeholder="Badge"
              className="border p-2 rounded"
              value={formData.badge}
              onChange={(e) => handleInputChange("badge", e.target.value)}
            />
            <input
              type="text"
              placeholder="Level"
              className="border p-2 rounded"
              value={formData.level}
              onChange={(e) => handleInputChange("level", e.target.value)}
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              className="border p-2 rounded col-span-full"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
            />
            <input
              type="text"
              readOnly
              className="border p-2 rounded bg-gray-100"
              value={`Total Hours: ${formData.totalHours}`}
            />
            <input
              type="text"
              readOnly
              className="border p-2 rounded bg-gray-100"
              value={`Watched Hours: ${formData.watchedHours}`}
            />
            <input
              type="text"
              readOnly
              className="border p-2 rounded bg-gray-100"
              value={`Assessments: ${formData.assessments}`}
            />
            <input
              type="text"
              readOnly
              className="border p-2 rounded bg-gray-100"
              value={`Assignments: ${formData.assignments}`}
            />
            <input
              type="text"
              readOnly
              className="border p-2 rounded bg-gray-100"
              value={`Questions: ${formData.questions}`}
            />
          </div>
          <button
            onClick={handleAddModule}
            className="text-primary underline mb-4"
          >
            ➕ Add Module
          </button>
          {formData.modules.map((module, mIndex) => (
            <div
              key={mIndex}
              className="border p-4 rounded bg-white mb-6 shadow-sm"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleModule(mIndex)}
              >
                <h3 className="text-lg font-medium text-gray-800">
                  📦 Module {mIndex + 1}: {module.moduleTitle || "Untitled"}
                </h3>
                <div className="flex gap-4 items-center">
                  <span className="text-sm text-gray-500">
                    {module.completed ? "✅ Completed" : "❌ Incomplete"}
                  </span>
                  <button
                    onClick={() => handleRemoveModule(mIndex)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {openModules.includes(mIndex) && (
                <>
                  <input
                    type="text"
                    placeholder="Module Title"
                    className="border p-2 rounded w-full mt-2"
                    value={module.moduleTitle}
                    onChange={(e) => {
                      const updated = [...formData.modules];
                      updated[mIndex].moduleTitle = e.target.value;
                      updateAndSetModules(updated);
                    }}
                  />
                  <textarea
                    placeholder="Module Description"
                    className="border p-2 rounded w-full mt-2"
                    value={module.description}
                    onChange={(e) => {
                      const updated = [...formData.modules];
                      updated[mIndex].description = e.target.value;
                      updateAndSetModules(updated);
                    }}
                  />
                  <button
                    onClick={() => handleAddTopic(mIndex)}
                    className="text-primary text-sm mt-2"
                  >
                    ➕ Add Topic
                  </button>

                  {module.topics.map((topic, tIndex) => {
                    const topicKey = `${mIndex}-${tIndex}`;
                    return (
                      <div
                        key={tIndex}
                        className="ml-4 mt-4 border-l pl-4 border-gray-300"
                      >
                        <div
                          className="flex justify-between items-center cursor-pointer"
                          onClick={() => toggleTopic(mIndex, tIndex)}
                        >
                          <h4 className="font-semibold">
                            🧩 Topic {tIndex + 1}:{" "}
                            {topic.topicTitle || "Untitled"}
                          </h4>
                          <div className="flex gap-4 items-center">
                            <span className="text-sm text-gray-500">
                              {topic.completed ? "✅" : "❌"}
                            </span>
                            <button
                              onClick={() => handleRemoveTopic(mIndex, tIndex)}
                              className="text-red-500 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {openTopics[topicKey] && (
                          <>
                            <input
                              type="text"
                              placeholder="Topic Title"
                              className="border p-2 rounded w-full mt-2"
                              value={topic.topicTitle}
                              onChange={(e) => {
                                const updated = [...formData.modules];
                                updated[mIndex].topics[tIndex].topicTitle =
                                  e.target.value;
                                updateAndSetModules(updated);
                              }}
                            />
                            <button
                              onClick={() => handleAddContent(mIndex, tIndex)}
                              className="text-green-600 text-xs mt-2 underline"
                            >
                              ➕ Add Content
                            </button>

                            {topic.contents.map((content, cIndex) => (
                              <div
                                key={cIndex}
                                className="ml-4 mt-3 space-y-2 border-l pl-4"
                              >
                                <select
                                  value={content.type}
                                  onChange={(e) => {
                                    const updated = [...formData.modules];
                                    updated[mIndex].topics[tIndex].contents[
                                      cIndex
                                    ].type = e.target.value;
                                    updateAndSetModules(updated);
                                  }}
                                  className="border p-2 rounded w-full"
                                >
                                  {contentTypes.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  placeholder="Content Name"
                                  className="border p-2 rounded w-full"
                                  value={content.name}
                                  onChange={(e) => {
                                    const updated = [...formData.modules];
                                    updated[mIndex].topics[tIndex].contents[
                                      cIndex
                                    ].name = e.target.value;
                                    updateAndSetModules(updated);
                                  }}
                                />
                                {["video", "audio"].includes(content.type) && (
                                  <input
                                    type="text"
                                    placeholder="Duration (hours)"
                                    className="border p-2 rounded w-full"
                                    value={content.duration}
                                    onChange={(e) => {
                                      const updated = [...formData.modules];
                                      updated[mIndex].topics[tIndex].contents[
                                        cIndex
                                      ].duration = e.target.value;
                                      updateAndSetModules(updated);
                                    }}
                                  />
                                )}
                                {["pdf", "image"].includes(content.type) && (
                                  <input
                                    type="text"
                                    placeholder="Pages"
                                    className="border p-2 rounded w-full"
                                    value={content.pages}
                                    onChange={(e) => {
                                      const updated = [...formData.modules];
                                      updated[mIndex].topics[tIndex].contents[
                                        cIndex
                                      ].pages = e.target.value;
                                      updateAndSetModules(updated);
                                    }}
                                  />
                                )}
                                <input
                                  type="text"
                                  placeholder="Content URL"
                                  className="border p-2 rounded w-full"
                                  value={content.url}
                                  onChange={(e) => {
                                    const updated = [...formData.modules];
                                    updated[mIndex].topics[tIndex].contents[
                                      cIndex
                                    ].url = e.target.value;
                                    updateAndSetModules(updated);
                                  }}
                                />
                                <label className="inline-flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={content.completed}
                                    onChange={(e) => {
                                      const updated = [...formData.modules];
                                      updated[mIndex].topics[tIndex].contents[
                                        cIndex
                                      ].completed = e.target.checked;
                                      updateAndSetModules(updated);
                                    }}
                                  />
                                  <span className="text-sm">Completed</span>
                                </label>
                                <button
                                  onClick={() =>
                                    handleRemoveContent(mIndex, tIndex, cIndex)
                                  }
                                  className="text-red-500 ml-2 text-sm"
                                >
                                  Remove
                                </button>
                                <button
                                  onClick={() =>
                                    handleAddQuestion(mIndex, tIndex, cIndex)
                                  }
                                  className="text-blue-600 text-xs mt-2 underline"
                                >
                                  ➕ Add Question
                                </button>
                                {content.questions?.map((q, qIndex) => (
                                  <div
                                    key={qIndex}
                                    className="border p-2 rounded mt-2"
                                  >
                                    <div className="flex justify-between items-center">
                                      <h5 className="font-semibold">
                                        Question {qIndex + 1}
                                      </h5>
                                      <button
                                        onClick={() => {
                                          const updated = [...formData.modules];
                                          updated[mIndex].topics[
                                            tIndex
                                          ].contents[cIndex].questions.splice(
                                            qIndex,
                                            1
                                          );
                                          updateAndSetModules(updated);
                                        }}
                                        className="text-red-500 text-sm"
                                      >
                                        ❌ Remove Question
                                      </button>
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Question Text"
                                      className="border p-2 rounded w-full mb-2"
                                      value={q.question}
                                      onChange={(e) => {
                                        const updated = [...formData.modules];
                                        updated[mIndex].topics[tIndex].contents[
                                          cIndex
                                        ].questions[qIndex].question =
                                          e.target.value;
                                        updateAndSetModules(updated);
                                      }}
                                    />

                                    <label className="text-sm flex items-center gap-2 mb-2">
                                      <input
                                        type="checkbox"
                                        checked={q.multiSelect}
                                        onChange={(e) => {
                                          const updated = [...formData.modules];
                                          updated[mIndex].topics[
                                            tIndex
                                          ].contents[cIndex].questions[
                                            qIndex
                                          ].multiSelect = e.target.checked;
                                          updated[mIndex].topics[
                                            tIndex
                                          ].contents[cIndex].questions[
                                            qIndex
                                          ].answer = e.target.checked ? [] : "";
                                          updateAndSetModules(updated);
                                        }}
                                      />
                                      Multi-select
                                    </label>

                                    {q.options.map((opt, oIndex) => (
                                      <div
                                        key={oIndex}
                                        className="flex gap-2 mb-1"
                                      >
                                        <input
                                          type="text"
                                          placeholder={`Option ${oIndex + 1}`}
                                          className="border p-2 rounded w-full"
                                          value={opt}
                                          onChange={(e) => {
                                            const updated = [
                                              ...formData.modules,
                                            ];
                                            updated[mIndex].topics[
                                              tIndex
                                            ].contents[cIndex].questions[
                                              qIndex
                                            ].options[oIndex] = e.target.value;
                                            updateAndSetModules(updated);
                                          }}
                                        />
                                        {q.options.length > 2 && (
                                          <button
                                            onClick={() => {
                                              const updated = [
                                                ...formData.modules,
                                              ];
                                              updated[mIndex].topics[
                                                tIndex
                                              ].contents[cIndex].questions[
                                                qIndex
                                              ].options.splice(oIndex, 1);
                                              updateAndSetModules(updated);
                                            }}
                                            className="text-red-500 text-sm"
                                          >
                                            ❌
                                          </button>
                                        )}
                                      </div>
                                    ))}

                                    <button
                                      onClick={() => {
                                        const updated = [...formData.modules];
                                        updated[mIndex].topics[tIndex].contents[
                                          cIndex
                                        ].questions[qIndex].options.push("");
                                        updateAndSetModules(updated);
                                      }}
                                      className="text-xs text-green-600 mt-1"
                                    >
                                      ➕ Add Option
                                    </button>

                                    <div className="mt-2">
                                      <label className="text-sm block mb-1">
                                        Answer:
                                      </label>
                                      {!q.multiSelect ? (
                                        <select
                                          className="border p-2 rounded w-full"
                                          value={q.answer || ""}
                                          onChange={(e) => {
                                            const updated = [
                                              ...formData.modules,
                                            ];
                                            updated[mIndex].topics[
                                              tIndex
                                            ].contents[cIndex].questions[
                                              qIndex
                                            ].answer = e.target.value;
                                            updateAndSetModules(updated);
                                          }}
                                        >
                                          <option value="">Select one</option>
                                          {q.options.map((opt, i) => (
                                            <option key={i} value={opt}>
                                              {opt}
                                            </option>
                                          ))}
                                        </select>
                                      ) : (
                                        <div className="space-y-1">
                                          {q.options.map((opt, i) => (
                                            <label key={i} className="block">
                                              <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={q.answer?.includes(
                                                  opt
                                                )}
                                                onChange={(e) => {
                                                  const updated = [
                                                    ...formData.modules,
                                                  ];
                                                  const answerArr = [
                                                    ...(q.answer || []),
                                                  ];
                                                  if (e.target.checked) {
                                                    if (
                                                      !answerArr.includes(opt)
                                                    )
                                                      answerArr.push(opt);
                                                  } else {
                                                    const idx =
                                                      answerArr.indexOf(opt);
                                                    if (idx !== -1)
                                                      answerArr.splice(idx, 1);
                                                  }
                                                  updated[mIndex].topics[
                                                    tIndex
                                                  ].contents[cIndex].questions[
                                                    qIndex
                                                  ].answer = answerArr;
                                                  updateAndSetModules(updated);
                                                }}
                                              />
                                              {opt}
                                            </label>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ))}

          <button
            onClick={handleCreateEnrollment}
            className="mt-6 ml-4 bg-primary hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            ✅ Create Enrollment
          </button>
        </>
      )}
    </div>
  );
};

export default CourseEnrolledAdd;
