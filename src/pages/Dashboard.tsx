
import React from "react";
import { Link } from "react-router-dom";
import { Book, Award, Clock, BookOpen } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

// Mock data
const learningStats = {
  totalLearningTime: "12.5 hours",
  coursesCompleted: "0 / 3",
  assessmentsPassed: "4",
};

const recommendedCourses = [
  {
    id: "js-advance",
    title: "JavaScript Advance",
    subtitle: "Master modern JavaScript concepts",
    instructor: "John Smith",
    duration: "2h 15m",
  },
  {
    id: "react",
    title: "React",
    subtitle: "Build modern user interfaces",
    instructor: "Sarah Lee",
    duration: "3h 30m",
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    subtitle: "Protect systems from threats",
    instructor: "Michael Chen",
    duration: "4h 45m",
  },
];

export default function Dashboard() {
  return (
    <PageLayout
      title="Dashboard"
      subtitle="Welcome back, admin-demo! Here's what's happening with your training platform."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Statistics */}
        <div className="kombee-card">
          <h2 className="text-xl font-bold text-white mb-4">Learning Statistics</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-purple-800/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Learning Time</div>
                <div className="text-xl font-bold text-white">{learningStats.totalLearningTime}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-green-800/20 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Courses Completed</div>
                <div className="text-xl font-bold text-white">{learningStats.coursesCompleted}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-yellow-800/20 flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Assessments Passed</div>
                <div className="text-xl font-bold text-white">{learningStats.assessmentsPassed}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        <div className="kombee-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Continue Learning</h2>
            <Link to="/courses" className="text-primary text-sm hover:underline">
              View all
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center h-[240px] text-center">
            <div className="mb-4">
              <Book className="w-12 h-12 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No courses in progress</h3>
            <p className="text-muted-foreground mb-4">Start a course to see it here.</p>
            <Button asChild className="bg-primary text-white hover:bg-primary/90">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Recommended For You</h2>
          <Link to="/courses" className="text-primary text-sm hover:underline">
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <Link
              to={`/courses/${course.id}`}
              key={course.id}
              className="kombee-card hover:border-primary/50 transition-colors"
            >
              <div className="aspect-video bg-card/50 rounded-md mb-3 flex items-center justify-center text-muted-foreground text-sm">
                Course Thumbnail
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{course.subtitle}</p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <div className="flex items-center">
                  <span className="w-5 h-5 rounded-full bg-primary/20 inline-flex items-center justify-center mr-1">
                    <span className="text-primary">U</span>
                  </span>
                  {course.instructor}
                </div>
                <div>{course.duration}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="kombee-card">
          <h2 className="text-xl font-bold text-white mb-4">Quick Links</h2>
          <div className="space-y-3">
            <Link
              to="/courses"
              className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-card/50 transition-colors"
            >
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-white">All Courses</span>
            </Link>
            <Link
              to="/assessments"
              className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-card/50 transition-colors"
            >
              <Award className="h-5 w-5 text-primary" />
              <span className="text-white">Assessments</span>
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-card/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="text-white">My Profile</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center gap-3 py-2 px-3 rounded-md hover:bg-card/50 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M3 3v18h18"></path>
                <path d="M18.4 9.6a9 9 0 0 0-9.2 9.8"></path>
                <path d="m8 4 4 4-4 4"></path>
              </svg>
              <span className="text-white">Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
