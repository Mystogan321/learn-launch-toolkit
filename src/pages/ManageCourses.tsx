
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, X, Trash } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";

// Mock data for our courses
const mockCourses = [
  {
    id: "js-advance",
    title: "JavaScript Advance",
    category: "Web Development",
    status: "published",
    dateCreated: "Apr 28, 2025",
    modules: 1,
    lessons: 1,
  },
  {
    id: "react",
    title: "React",
    category: "Web Development",
    status: "review",
    dateCreated: "Apr 28, 2025",
    modules: 1,
    lessons: 0,
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    category: "Cybersecurity",
    status: "published",
    dateCreated: "Apr 28, 2025",
    modules: 1,
    lessons: 3,
  },
];

export default function ManageCourses() {
  const navigate = useNavigate();
  const [courses] = useState(mockCourses);

  return (
    <PageLayout
      title="Manage Courses"
      action={
        <Button 
          onClick={() => navigate("/courses/new")} 
          className="bg-primary text-white hover:bg-primary/90"
        >
          <Plus size={18} className="mr-2" />
          New Course
        </Button>
      }
    >
      <div className="kombee-card shadow-md border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b border-border text-muted-foreground">
                <th className="py-3 pl-4 pr-3 font-medium">COURSE</th>
                <th className="py-3 px-3 font-medium">CATEGORY</th>
                <th className="py-3 px-3 font-medium">STATUS</th>
                <th className="py-3 px-3 font-medium">DATE CREATED</th>
                <th className="py-3 px-3 font-medium">CONTENT</th>
                <th className="py-3 px-3 font-medium text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-border hover:bg-card/50 transition-colors"
                >
                  <td className="py-3 pl-4 pr-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-card flex items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                      <div>
                        <div className="font-medium text-kombee-text">{course.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {course.modules} modules · {course.lessons} lessons
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {course.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        course.status === "published"
                          ? "bg-green-500/20 text-green-500"
                          : "bg-yellow-500/20 text-yellow-500"
                      }`}
                    >
                      {course.status === "published" ? "Published" : "Review"}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {course.dateCreated}
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      to={`/courses/${course.id}/content`}
                      className="text-primary hover:text-primary/80 text-sm"
                    >
                      Manage content &gt;
                    </Link>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-kombee-text"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-kombee-text"
                        onClick={() => navigate(`/courses/${course.id}/edit`)}
                      >
                        <Pencil size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-kombee-text"
                      >
                        <X size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}
