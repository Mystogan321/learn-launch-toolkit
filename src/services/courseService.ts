
import { api, ApiResponse } from './api';

// Types
export interface CourseCategory {
  id: string;
  name: string;
}

export interface CourseLecture {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  content?: string;
  duration?: number;
  order: number;
}

export interface CourseSection {
  id: string;
  title: string;
  order: number;
  lectures: CourseLecture[];
}

export interface CourseFormData {
  id?: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  language?: string;
  duration?: number;
  isPublicPreview?: boolean;
  enableCertificates?: boolean;
  enableDrip?: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  thumbnail?: File | string;
  promoVideo?: File | string;
  sections: CourseSection[];
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
  targetAudience?: string;
  resources?: File[] | string[];
  isDraft?: boolean;
  termsAccepted?: boolean;
}

// Mock data for categories
const mockCategories: CourseCategory[] = [
  { id: '1', name: 'Web Development' },
  { id: '2', name: 'Data Science' },
  { id: '3', name: 'Design' },
  { id: '4', name: 'Business' },
  { id: '5', name: 'Marketing' },
  { id: '6', name: 'IT & Software' },
  { id: '7', name: 'Personal Development' },
  { id: '8', name: 'Cybersecurity' },
];

// Course service with methods for course operations
export const courseService = {
  // Get all categories
  getCategories: async (): Promise<ApiResponse<CourseCategory[]>> => {
    // In real application, this would call the API
    // For now, we'll return mock data
    return {
      success: true,
      data: mockCategories,
    };
  },

  // Create a new course
  createCourse: async (courseData: CourseFormData): Promise<ApiResponse<CourseFormData>> => {
    // This would send the data to the API
    console.log('Creating course with data:', courseData);
    
    // For now, we'll simulate a successful API response
    return {
      success: true,
      data: { 
        ...courseData, 
        id: Math.random().toString(36).substring(2, 15),
      },
      message: 'Course created successfully',
    };
  },

  // Update an existing course
  updateCourse: async (id: string, courseData: CourseFormData): Promise<ApiResponse<CourseFormData>> => {
    console.log(`Updating course ${id} with data:`, courseData);
    
    // Simulate API response
    return {
      success: true,
      data: { 
        ...courseData, 
        id,
      },
      message: 'Course updated successfully',
    };
  },

  // Get course by ID
  getCourse: async (id: string): Promise<ApiResponse<CourseFormData>> => {
    console.log(`Getting course with id: ${id}`);
    
    // Simulate API response with a mock course
    return {
      success: true,
      data: {
        id,
        title: 'JavaScript Advanced',
        subtitle: 'Master modern JavaScript concepts and patterns',
        description: 'A comprehensive course covering advanced JavaScript topics...',
        category: '1',
        level: 'intermediate',
        tags: ['JavaScript', 'ES6', 'Web Development'],
        learningObjectives: ['Understand JavaScript closures', 'Master async/await'],
        prerequisites: ['Basic JavaScript knowledge'],
        targetAudience: 'Developers who want to improve their JavaScript skills',
        sections: [
          {
            id: 's1',
            title: 'Introduction',
            order: 0,
            lectures: [
              {
                id: 'l1',
                title: 'Course Overview',
                type: 'video',
                duration: 15,
                order: 0,
              }
            ]
          }
        ],
      },
    };
  },

  // Upload course thumbnail
  uploadThumbnail: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    // In a real app, this would upload the file to a server
    console.log('Uploading thumbnail:', file.name);
    
    // Simulate successful upload
    return {
      success: true,
      data: {
        url: URL.createObjectURL(file),
      },
      message: 'Thumbnail uploaded successfully',
    };
  },

  // Upload course promo video
  uploadPromoVideo: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    console.log('Uploading promo video:', file.name);
    
    // Simulate successful upload
    return {
      success: true,
      data: {
        url: URL.createObjectURL(file),
      },
      message: 'Promo video uploaded successfully',
    };
  },

  // Upload resource files
  uploadResources: async (files: File[]): Promise<ApiResponse<{ urls: string[] }>> => {
    console.log('Uploading resources:', files.map(f => f.name));
    
    // Simulate successful upload
    return {
      success: true,
      data: {
        urls: files.map(file => URL.createObjectURL(file)),
      },
      message: 'Resources uploaded successfully',
    };
  },

  // Generate slug from title
  generateSlug: (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
  },
};
