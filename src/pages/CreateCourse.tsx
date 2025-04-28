
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check, Save } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurriculumBuilder } from "@/components/courses/CurriculumBuilder";
import { TagInput } from "@/components/courses/TagInput";
import { FileUpload } from "@/components/courses/FileUpload";
import { courseService, CourseFormData, CourseCategory } from "@/services/courseService";

// Constants for form validation
const REQUIRED_FIELDS = ["title", "description", "category"];

export default function CreateCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Form state
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "beginner",
    language: "English",
    duration: 0,
    isPublicPreview: false,
    enableCertificates: true,
    enableDrip: false,
    slug: "",
    metaTitle: "",
    metaDescription: "",
    thumbnail: null,
    promoVideo: null,
    sections: [],
    tags: [],
    learningObjectives: [],
    prerequisites: [],
    targetAudience: "",
    termsAccepted: false,
  });

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      const response = await courseService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    }
    
    fetchCategories();
  }, []);

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title) {
      const generatedSlug = courseService.generateSlug(formData.title);
      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
        metaTitle: prev.metaTitle || formData.title,
      }));
    }
  }, [formData.title]);

  // Set up auto-save
  useEffect(() => {
    // Wait for initial data to be loaded before setting up auto-save
    if (!formData.title) return;

    const autoSaveInterval = setInterval(() => {
      handleAutoSave();
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [formData]);

  // Handle text input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when field is filled
    if (validationErrors[name] && value.trim()) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear validation error when field is filled
    if (validationErrors[name] && value) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle file uploads
  const handleFileChange = (name: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      
      // Show toast notification
      toast.error("Please fix the errors in the form");
      
      // Scroll to the top to show the error summary
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Set draft status based on button clicked
      const dataToSubmit = {
        ...formData,
        isDraft: saveAsDraft,
      };
      
      // Submit the form data
      const response = await courseService.createCourse(dataToSubmit);
      
      if (response.success) {
        toast.success(
          saveAsDraft
            ? "Course saved as draft successfully"
            : "Course submitted successfully"
        );
        
        // Navigate to the courses page
        navigate("/courses");
      } else {
        toast.error(response.error || "Failed to create course");
      }
    } catch (error) {
      console.error("Error submitting course:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate the form
  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Check required fields
    REQUIRED_FIELDS.forEach((field) => {
      // @ts-ignore - dynamic field access
      if (!formData[field] || formData[field].trim() === "") {
        errors[field] = "This field is required";
      }
    });
    
    // Check if terms are accepted for final submission (not draft)
    if (!saveAsDraft && !formData.termsAccepted) {
      errors.termsAccepted = "You must accept the terms and conditions";
    }
    
    return errors;
  };

  // Handle auto-save
  const handleAutoSave = async () => {
    // Don't auto-save if the user is actively submitting
    if (isSubmitting) return;
    
    // Skip auto-save if no title is set yet (form is mostly empty)
    if (!formData.title.trim()) return;
    
    setAutoSaving(true);
    
    try {
      // Auto-save as draft
      const dataToSubmit = {
        ...formData,
        isDraft: true,
      };
      
      const response = await courseService.createCourse(dataToSubmit);
      
      if (response.success) {
        // Update the last saved timestamp
        setLastSaved(new Date());
        console.log("Course auto-saved successfully");
      }
    } catch (error) {
      console.error("Error auto-saving course:", error);
    } finally {
      setAutoSaving(false);
    }
  };

  return (
    <PageLayout
      title="Create New Course"
      subtitle="Add all details to create a comprehensive learning experience"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Validation Errors Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <h3 className="text-destructive font-medium mb-2">
              Please fix the following errors:
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field} className="text-destructive text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Auto-save Indicator */}
        {autoSaving && (
          <div className="fixed bottom-4 right-4 bg-primary/80 text-white px-4 py-2 rounded-md shadow-lg z-50">
            Auto-saving...
          </div>
        )}
        {lastSaved && !autoSaving && (
          <div className="fixed bottom-4 right-4 bg-card text-card-foreground px-4 py-2 rounded-md shadow-lg z-50">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}

        {/* Basic Information */}
        <div className="kombee-card">
          <h2 className="text-xl font-bold text-white mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white">
                Course Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Advanced JavaScript for Professionals"
                className={`kombee-input ${
                  validationErrors.title ? "border-destructive" : ""
                }`}
              />
              {validationErrors.title && (
                <p className="text-destructive text-xs mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="subtitle" className="text-white">
                Course Subtitle
              </Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="e.g., Master the latest JS features and patterns"
                className="kombee-input"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">
                Course Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Provide a detailed description of your course content and benefits..."
                className={`kombee-input min-h-[150px] ${
                  validationErrors.description ? "border-destructive" : ""
                }`}
              />
              {validationErrors.description && (
                <p className="text-destructive text-xs mt-1">
                  {validationErrors.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Rich text editor would be integrated here in production
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-white">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger
                    id="category"
                    className={`kombee-input ${
                      validationErrors.category ? "border-destructive" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors.category && (
                  <p className="text-destructive text-xs mt-1">
                    {validationErrors.category}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="level" className="text-white">
                  Course Level
                </Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => 
                    handleSelectChange("level", value as CourseFormData['level'])
                  }
                >
                  <SelectTrigger id="level" className="kombee-input">
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all-levels">All Levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language" className="text-white">
                  Language
                </Label>
                <Select
                  value={formData.language}
                  onValueChange={(value) => handleSelectChange("language", value)}
                >
                  <SelectTrigger id="language" className="kombee-input">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Arabic">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration" className="text-white">
                  Estimated Duration (minutes)
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="0"
                  value={formData.duration || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., 120"
                  className="kombee-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublicPreview"
                  checked={formData.isPublicPreview}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("isPublicPreview", checked === true)
                  }
                />
                <Label htmlFor="isPublicPreview" className="text-white cursor-pointer">
                  Public Preview
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableCertificates"
                  checked={formData.enableCertificates}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("enableCertificates", checked === true)
                  }
                />
                <Label htmlFor="enableCertificates" className="text-white cursor-pointer">
                  Enable Certificates
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableDrip"
                  checked={formData.enableDrip}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("enableDrip", checked === true)
                  }
                />
                <Label htmlFor="enableDrip" className="text-white cursor-pointer">
                  Enable Drip Content
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug" className="text-white">
                  URL Slug
                </Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="course-url-slug"
                  className="kombee-input"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from title, but you can customize it
                </p>
              </div>

              <div>
                <Label htmlFor="metaTitle" className="text-white">
                  SEO Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="Meta title for search engines"
                  className="kombee-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="metaDescription" className="text-white">
                SEO Meta Description
              </Label>
              <Textarea
                id="metaDescription"
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                placeholder="Brief description for search engines"
                className="kombee-input"
              />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="kombee-card">
          <h2 className="text-xl font-bold text-white mb-6">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label className="text-white mb-2 block">Course Thumbnail</Label>
              <FileUpload
                label="Upload Thumbnail"
                accept="image/*"
                maxSize={2} // 2MB
                onChange={(file) => handleFileChange("thumbnail", file)}
                value={formData.thumbnail}
                helperText="Recommended: 1280x720px, max 2MB"
              />
            </div>

            <div>
              <Label className="text-white mb-2 block">Promotional Video</Label>
              <FileUpload
                label="Upload Promo Video"
                accept="video/*"
                maxSize={50} // 50MB
                onChange={(file) => handleFileChange("promoVideo", file)}
                value={formData.promoVideo}
                helperText="Max 50MB, MP4 format recommended"
              />
            </div>
          </div>
        </div>

        {/* Curriculum */}
        <div className="kombee-card">
          <h2 className="text-xl font-bold text-white mb-6">Curriculum</h2>
          <CurriculumBuilder
            sections={formData.sections}
            onSectionsChange={(sections) =>
              setFormData((prev) => ({ ...prev, sections }))
            }
          />
        </div>

        {/* Tags & Skills */}
        <div className="kombee-card">
          <h2 className="text-xl font-bold text-white mb-6">Tags & Skills</h2>
          <div>
            <Label htmlFor="tags" className="text-white mb-2 block">
              Tags (what students will learn)
            </Label>
            <TagInput
              value={formData.tags}
              onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              placeholder="e.g., React, Machine Learning, Data Analysis"
              maxTags={10}
            />
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="kombee-card">
          <h2 className="text-xl font-bold text-white mb-6">Learning Objectives</h2>
          <div>
            <Label htmlFor="learningObjectives" className="text-white mb-2 block">
              What students will learn
            </Label>
            <TagInput
              value={formData.learningObjectives}
              onChange={(objectives) =>
                setFormData((prev) => ({ ...prev, learningObjectives: objectives }))
              }
              placeholder="e.g., Build a complete web application from scratch"
              maxTags={15}
            />
          </div>
        </div>

        {/* Prerequisites & Target Audience */}
        <div className="kombee-card">
          <h2 className="text-xl font-bold text-white mb-6">Prerequisites & Target Audience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="prerequisites" className="text-white mb-2 block">
                Prerequisites
              </Label>
              <TagInput
                value={formData.prerequisites}
                onChange={(prerequisites) =>
                  setFormData((prev) => ({ ...prev, prerequisites }))
                }
                placeholder="e.g., Basic JavaScript knowledge"
                maxTags={10}
              />
            </div>

            <div>
              <Label htmlFor="targetAudience" className="text-white mb-2 block">
                Target Audience
              </Label>
              <Textarea
                id="targetAudience"
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleInputChange}
                placeholder="Describe your ideal students for this course..."
                className="kombee-input min-h-[120px]"
              />
            </div>
          </div>
        </div>

        {/* Terms & Submit */}
        <div className="kombee-card">
          <div className="flex items-start space-x-2 mb-6">
            <Checkbox
              id="termsAccepted"
              checked={formData.termsAccepted}
              onCheckedChange={(checked) =>
                handleCheckboxChange("termsAccepted", checked === true)
              }
              className={validationErrors.termsAccepted ? "border-destructive" : ""}
            />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor="termsAccepted"
                className={`text-white cursor-pointer ${
                  validationErrors.termsAccepted ? "text-destructive" : ""
                }`}
              >
                I accept the terms and conditions
              </Label>
              <p className="text-xs text-muted-foreground">
                By submitting this course, you agree to our terms of service and content guidelines.
              </p>
              {validationErrors.termsAccepted && (
                <p className="text-destructive text-xs">
                  {validationErrors.termsAccepted}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/courses")}
              disabled={isSubmitting}
              className="text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isSubmitting}
              className="border-primary text-primary hover:bg-primary hover:text-white"
              onClick={() => {
                setSaveAsDraft(true);
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white"
              onClick={() => {
                setSaveAsDraft(false);
              }}
            >
              <Check className="mr-2 h-4 w-4" />
              Submit for Review
              {isSubmitting && (
                <span className="ml-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </PageLayout>
  );
}
