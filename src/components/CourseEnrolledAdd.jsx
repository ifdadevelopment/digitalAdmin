import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCourses,
  selectCourses,
  selectCourseStatus,
} from '../store/courseSlice';

const contentTypes = ['video', 'pdf', 'image', 'audio', 'test'];

const CourseEnrolledAdd = () => {
  const dispatch = useDispatch();
  const courses = useSelector(selectCourses);
  const status = useSelector(selectCourseStatus);

  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [formData, setFormData] = useState({
    badge: '',
    level: '',
    tags: '',
    modules: [],
    totalHours: 0,
    watchedHours: 0,
  });

  const [openModules, setOpenModules] = useState([]);
  const [openTopics, setOpenTopics] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCourses({ type: 'student' }));
    }
  }, [dispatch, status]);

  const calculateDurations = (modules) => {
    let total = 0;
    let watched = 0;

    modules.forEach((module) => {
      module.completed = true;

      module.topics.forEach((topic) => {
        topic.completed = true;

        topic.contents.forEach((content) => {
          const isVideoOrAudio = ['video', 'audio'].includes(content.type);
          const isPdfOrImage = ['pdf', 'image'].includes(content.type);

          const duration = parseFloat(content.duration) || 0;

          if (isVideoOrAudio) {
            total += duration;
            if (content.completed) watched += duration;
            else topic.completed = module.completed = false;
          } else if (isPdfOrImage) {
            if (!content.url || !content.pages) topic.completed = module.completed = false;
          }
        });
      });
    });

    return { totalHours: parseFloat(total.toFixed(2)), watchedHours: parseFloat(watched.toFixed(2)) };
  };

  const updateAndSetModules = (updatedModules) => {
    const { totalHours, watchedHours } = calculateDurations(updatedModules);
    setFormData((prev) => ({
      ...prev,
      modules: updatedModules,
      totalHours,
      watchedHours,
    }));
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddModule = () => {
    const newModules = [
      ...formData.modules,
      {
        moduleTitle: '',
        description: '',
        completed: false,
        topics: [],
      },
    ];
    updateAndSetModules(newModules);
  };

  const handleAddTopic = (moduleIndex) => {
    const updated = [...formData.modules];
    updated[moduleIndex].topics.push({
      topicTitle: '',
      completed: false,
      contents: [],
    });
    updateAndSetModules(updated);
  };

  const handleAddContent = (moduleIndex, topicIndex) => {
    const updated = [...formData.modules];
    updated[moduleIndex].topics[topicIndex].contents.push({
      type: 'video',
      name: '',
      duration: '',
      pages: '',
      url: '',
      completed: false,
    });
    updateAndSetModules(updated);
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
        {courses
          .filter((course) => course.userType === 'student')
          .map((course) => (
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
              onChange={(e) => handleInputChange('badge', e.target.value)}
            />
            <input
              type="text"
              placeholder="Level"
              className="border p-2 rounded"
              value={formData.level}
              onChange={(e) => handleInputChange('level', e.target.value)}
            />
            <input
              type="text"
              placeholder="Tags (comma-separated)"
              className="border p-2 rounded col-span-full"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
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
                  📦 Module {mIndex + 1}: {module.moduleTitle || 'Untitled'}
                </h3>
                <span className="text-sm text-gray-500">
                  {module.completed ? '✅ Completed' : '❌ Incomplete'}
                </span>
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
                    className="text-primary text-sm mt-2 underline"
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
                            🧩 Topic {tIndex + 1}:{' '}
                            {topic.topicTitle || 'Untitled'}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {topic.completed ? '✅' : '❌'}
                          </span>
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

                            {topic.contents.map((content, cIndex) => {
                              const isVideoOrAudio = ['video', 'audio'].includes(
                                content.type
                              );
                              const isPdfOrImage = ['pdf', 'image'].includes(
                                content.type
                              );

                              return (
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
                                  {isVideoOrAudio && (
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
                                  {isPdfOrImage && (
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
                                </div>
                              );
                            })}
                          </>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default CourseEnrolledAdd;
