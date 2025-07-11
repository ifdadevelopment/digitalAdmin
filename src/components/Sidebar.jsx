import React, { useState } from "react";
import {
  FiMenu,
  FiHome,
  FiBookOpen,
  FiFileText,
  FiCreditCard,
  FiAward,
  FiChevronDown,
  FiChevronRight,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [isCourseStudentOpen, setIsCourseStudentOpen] = useState(false);
  const [isCourseTestOpen, setIsCourseTestOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCourseMenu = () => setIsCourseOpen(!isCourseOpen);
  const toggleCourseStudentMenu = () => setIsCourseStudentOpen(!isCourseStudentOpen);
  const toggleCourseTestMenu = () => setIsCourseTestOpen(!isCourseTestOpen);

  return (
    <div
      className={`bg-white text-primary h-screen transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      } flex flex-col`}
    >
      <div className="flex items-center justify-between p-4">
        <span
          className={`text-lg font-bold font-nunito ${
            !isOpen && "hidden"
          }`}
        >
        <img src={logo} alt="Admin LMS Logo" className="h-8 w-auto" />
        </span>
        <button onClick={toggleSidebar} className="text-primary">
          <FiMenu size={20} />
        </button>
      </div>
      <nav className="flex-1 px-2 space-y-1 text-sm font-bold font-nunito">
        <Link
          to="/admin/dashboard"
          className="flex items-center p-2 rounded-md transition hover:bg-primary hover:text-white"
        >
          <FiHome size={20} />
          {isOpen && <span className="ml-3">Dashboard</span>}
        </Link>
        <div>
          <button
            onClick={toggleCourseMenu}
            className="flex items-center w-full p-2 rounded-md transition hover:bg-primary hover:text-white"
          >
            <FiBookOpen size={20} />
            {isOpen && (
              <>
                <span className="ml-3">Course</span>
                <span className="ml-auto">
                  {isCourseOpen ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              </>
            )}
          </button>

          {/* Course submenu */}
          {isCourseOpen && (
            <div className={`ml-8 mt-1 space-y-1 ${!isOpen && "hidden"}`}>
              <Link
                to="/admin/courses/add"
                className="flex items-center text-sm p-2 rounded-md transition hover:bg-primary hover:text-white"
              >
                <span>Course Add</span>
              </Link>
              <Link
                to="/admin/courses/list"
                className="flex items-center text-sm p-2 rounded-md transition hover:bg-primary hover:text-white"
              >
                <span>Course List</span>
              </Link>
            </div>
          )}
        </div>
             <button
            onClick={toggleCourseStudentMenu}
            className="flex items-center w-full p-2 rounded-md transition hover:bg-primary hover:text-white"
          >
            <FiUser  size={20} />
            {isOpen && (
              <>
                <span className="ml-3">Course Student </span>
                <span className="ml-auto">
                  {isCourseStudentOpen ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              </>
            )}
          </button>
               {isCourseStudentOpen && (
            <div className={`ml-8 mt-1 space-y-1 ${!isOpen && "hidden"}`}>
              <Link
                to="/admin/CourseStudent/add"
                className="flex items-center text-sm p-2 rounded-md transition hover:bg-primary hover:text-white"
              >
                <span>Course Enrolled Add</span>
              </Link>
              <Link
                to="/admin/CourseStudent/list"
                className="flex items-center text-sm p-2 rounded-md transition hover:bg-primary hover:text-white"
              >
                <span>Course Enrolled List</span>
              </Link>
              <Link
                to="/admin/CourseStudent/progress"
                className="flex items-center text-sm p-2 rounded-md transition hover:bg-primary hover:text-white"
              >
                <span>Course Student Progress</span>
              </Link>
            </div>
          )}

  <button
            onClick={toggleCourseTestMenu}
            className="flex items-center w-full p-2 rounded-md transition hover:bg-primary hover:text-white"
          >
            <FiFileText  size={20} />
            {isOpen && (
              <>
                <span className="ml-3">Test </span>
                <span className="ml-auto">
                  {isCourseTestOpen ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              </>
            )}
          </button>
               {isCourseTestOpen && (
            <div className={`ml-8 mt-1 space-y-1 ${!isOpen && "hidden"}`}>
              <Link
                to="/admin/tests/add"
                className="flex items-center text-sm p-2 rounded-md transition hover:bg-primary hover:text-white"
              >
                <span>Course Test Add</span>
              </Link>
              <Link
                to="/admin/tests/list"
                className="flex items-center text-sm p-2 rounded-md transition hover:bg-primary hover:text-white"
              >
                <span>Course Test List</span>
              </Link>
              <Link
                to="/admin/tests/score"
                className="flex items-center text-sm p-2 rounded-md transition hover:bg-primary hover:text-white"
              >
                <span>Course Test Score</span>
              </Link>
            </div>
          )}
        <Link
          to="/admin/payments"
          className="flex items-center p-2 rounded-md transition hover:bg-primary hover:text-white"
        >
          <FiCreditCard size={20} />
          {isOpen && <span className="ml-3">Payment</span>}
        </Link>

        <Link
          to="/admin/certificates"
          className="flex items-center p-2 rounded-md transition hover:bg-primary hover:text-white"
        >
          <FiAward size={20} />
          {isOpen && <span className="ml-3">Certificate</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
