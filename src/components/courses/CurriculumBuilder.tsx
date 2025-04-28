
import React, { useState } from "react";
import { Plus, Trash, MoveUp, MoveDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { CourseSection, CourseLecture } from "@/services/courseService";

interface CurriculumBuilderProps {
  sections: CourseSection[];
  onSectionsChange: (sections: CourseSection[]) => void;
}

export function CurriculumBuilder({ 
  sections = [], 
  onSectionsChange 
}: CurriculumBuilderProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    sections.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  );

  // Generate a unique ID
  const generateId = () => `id_${Math.random().toString(36).substring(2, 11)}`;

  // Handle adding a new section
  const handleAddSection = () => {
    const newSection: CourseSection = {
      id: generateId(),
      title: `Section ${sections.length + 1}`,
      order: sections.length,
      lectures: [],
    };
    
    onSectionsChange([...sections, newSection]);
    setExpandedSections((prev) => ({ ...prev, [newSection.id]: true }));
  };

  // Handle removing a section
  const handleRemoveSection = (sectionId: string) => {
    const newSections = sections.filter((section) => section.id !== sectionId);
    
    // Update order of remaining sections
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    
    onSectionsChange(reorderedSections);
  };

  // Handle section title change
  const handleSectionTitleChange = (sectionId: string, title: string) => {
    const newSections = sections.map((section) =>
      section.id === sectionId ? { ...section, title } : section
    );
    
    onSectionsChange(newSections);
  };

  // Handle adding a new lecture to a section
  const handleAddLecture = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    
    if (!section) return;
    
    const newLecture: CourseLecture = {
      id: generateId(),
      title: `Lecture ${section.lectures.length + 1}`,
      type: 'video',
      order: section.lectures.length,
    };
    
    const newSections = sections.map((s) =>
      s.id === sectionId
        ? { ...s, lectures: [...s.lectures, newLecture] }
        : s
    );
    
    onSectionsChange(newSections);
  };

  // Handle removing a lecture
  const handleRemoveLecture = (sectionId: string, lectureId: string) => {
    const newSections = sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      const filteredLectures = section.lectures.filter(
        (lecture) => lecture.id !== lectureId
      );
      
      // Update order of remaining lectures
      const reorderedLectures = filteredLectures.map((lecture, index) => ({
        ...lecture,
        order: index,
      }));
      
      return { ...section, lectures: reorderedLectures };
    });
    
    onSectionsChange(newSections);
  };

  // Handle lecture details change
  const handleLectureChange = (
    sectionId: string,
    lectureId: string,
    field: keyof CourseLecture,
    value: string | number
  ) => {
    const newSections = sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      const newLectures = section.lectures.map((lecture) =>
        lecture.id === lectureId
          ? { ...lecture, [field]: value }
          : lecture
      );
      
      return { ...section, lectures: newLectures };
    });
    
    onSectionsChange(newSections);
  };

  // Handle moving a section up
  const handleMoveSectionUp = (sectionId: string) => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    
    if (sectionIndex <= 0) return;
    
    const newSections = [...sections];
    
    // Swap with the previous section
    [newSections[sectionIndex - 1], newSections[sectionIndex]] = [
      newSections[sectionIndex],
      newSections[sectionIndex - 1],
    ];
    
    // Update order
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    
    onSectionsChange(reorderedSections);
  };

  // Handle moving a section down
  const handleMoveSectionDown = (sectionId: string) => {
    const sectionIndex = sections.findIndex((s) => s.id === sectionId);
    
    if (sectionIndex === -1 || sectionIndex >= sections.length - 1) return;
    
    const newSections = [...sections];
    
    // Swap with the next section
    [newSections[sectionIndex], newSections[sectionIndex + 1]] = [
      newSections[sectionIndex + 1],
      newSections[sectionIndex],
    ];
    
    // Update order
    const reorderedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    
    onSectionsChange(reorderedSections);
  };

  // Handle moving a lecture up
  const handleMoveLectureUp = (sectionId: string, lectureId: string) => {
    const newSections = sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      const lectureIndex = section.lectures.findIndex((l) => l.id === lectureId);
      
      if (lectureIndex <= 0) return section;
      
      const newLectures = [...section.lectures];
      
      // Swap with the previous lecture
      [newLectures[lectureIndex - 1], newLectures[lectureIndex]] = [
        newLectures[lectureIndex],
        newLectures[lectureIndex - 1],
      ];
      
      // Update order
      const reorderedLectures = newLectures.map((lecture, index) => ({
        ...lecture,
        order: index,
      }));
      
      return { ...section, lectures: reorderedLectures };
    });
    
    onSectionsChange(newSections);
  };

  // Handle moving a lecture down
  const handleMoveLectureDown = (sectionId: string, lectureId: string) => {
    const newSections = sections.map((section) => {
      if (section.id !== sectionId) return section;
      
      const lectureIndex = section.lectures.findIndex((l) => l.id === lectureId);
      
      if (lectureIndex === -1 || lectureIndex >= section.lectures.length - 1)
        return section;
      
      const newLectures = [...section.lectures];
      
      // Swap with the next lecture
      [newLectures[lectureIndex], newLectures[lectureIndex + 1]] = [
        newLectures[lectureIndex + 1],
        newLectures[lectureIndex],
      ];
      
      // Update order
      const reorderedLectures = newLectures.map((lecture, index) => ({
        ...lecture,
        order: index,
      }));
      
      return { ...section, lectures: reorderedLectures };
    });
    
    onSectionsChange(newSections);
  };

  // Toggle section expanded state
  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Sections */}
      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="border border-border rounded-lg overflow-hidden"
            >
              {/* Section Header */}
              <div className="bg-card p-4 flex items-center gap-4">
                <div className="text-white font-medium w-8">
                  {index + 1}.
                </div>
                <div className="flex-1">
                  <Input
                    value={section.title}
                    onChange={(e) =>
                      handleSectionTitleChange(section.id, e.target.value)
                    }
                    placeholder="Section Title"
                    className="bg-card border-border text-white"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveSectionUp(section.id)}
                    disabled={index === 0}
                    className="text-white hover:text-primary"
                  >
                    <MoveUp size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveSectionDown(section.id)}
                    disabled={index === sections.length - 1}
                    className="text-white hover:text-primary"
                  >
                    <MoveDown size={18} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSectionExpanded(section.id)}
                    className="text-white hover:text-primary"
                  >
                    {expandedSections[section.id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="18 15 12 9 6 15"></polyline>
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveSection(section.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash size={18} />
                  </Button>
                </div>
              </div>

              {/* Section Content (Lectures) */}
              {expandedSections[section.id] && (
                <div className="p-4 bg-kombee-background space-y-4">
                  {/* Lectures */}
                  {section.lectures.length > 0 ? (
                    <div className="space-y-3">
                      {section.lectures.map((lecture, lectureIndex) => (
                        <div
                          key={lecture.id}
                          className="p-3 border border-border rounded-md bg-card/20"
                        >
                          <div className="flex items-start gap-3">
                            <div className="text-white font-medium w-8 pt-2">
                              {index + 1}.{lectureIndex + 1}
                            </div>
                            <div className="flex-1 space-y-3">
                              <Input
                                value={lecture.title}
                                onChange={(e) =>
                                  handleLectureChange(
                                    section.id,
                                    lecture.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Lecture Title"
                                className="bg-kombee-background border-border text-white"
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <Select
                                    value={lecture.type}
                                    onValueChange={(value) =>
                                      handleLectureChange(
                                        section.id,
                                        lecture.id,
                                        "type",
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="bg-kombee-background border-border text-white">
                                      <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="video">Video</SelectItem>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="quiz">Quiz</SelectItem>
                                      <SelectItem value="assignment">Assignment</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Input
                                    type="number"
                                    min="0"
                                    value={lecture.duration || ""}
                                    onChange={(e) =>
                                      handleLectureChange(
                                        section.id,
                                        lecture.id,
                                        "duration",
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    placeholder="Duration (minutes)"
                                    className="bg-kombee-background border-border text-white"
                                  />
                                </div>
                              </div>
                              {lecture.type === "text" && (
                                <Textarea
                                  value={lecture.content || ""}
                                  onChange={(e) =>
                                    handleLectureChange(
                                      section.id,
                                      lecture.id,
                                      "content",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Lecture content..."
                                  className="min-h-[100px] bg-kombee-background border-border text-white"
                                />
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleMoveLectureUp(section.id, lecture.id)
                                }
                                disabled={lectureIndex === 0}
                                className="text-white hover:text-primary"
                              >
                                <MoveUp size={16} />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleMoveLectureDown(section.id, lecture.id)
                                }
                                disabled={
                                  lectureIndex === section.lectures.length - 1
                                }
                                className="text-white hover:text-primary"
                              >
                                <MoveDown size={16} />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleRemoveLecture(section.id, lecture.id)
                                }
                                className="text-destructive hover:text-destructive/80"
                              >
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No lectures yet. Add your first lecture.
                    </div>
                  )}

                  {/* Add Lecture Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddLecture(section.id)}
                    className="w-full border-dashed text-white hover:text-primary"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Lecture
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium text-white mb-2">
            No Sections Yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Add your first section to start building your curriculum
          </p>
        </div>
      )}

      {/* Add Section Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddSection}
        className="w-full border-dashed text-white hover:text-primary"
      >
        <Plus size={18} className="mr-2" />
        Add Section
      </Button>
    </div>
  );
}
