
// Base API service for API calls
import { toast } from "@/components/ui/sonner";

// Default base URL - would be replaced with your actual API URL in production
const API_BASE_URL = '/api';

// Types for our API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// Main request function with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Set default headers if not provided
    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }

    const response = await fetch(url, options);
    
    // Parse the JSON response
    const data = await response.json();
    
    // Check if the response is successful (status code 2xx)
    if (!response.ok) {
      // Show error toast for failed requests
      toast.error(data.message || 'An error occurred');
      return {
        success: false,
        error: data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('API request error:', error);
    toast.error('Network error, please try again later');
    return {
      success: false,
      error: 'Network error, please try again later',
    };
  }
}

// Export commonly used methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { method: 'GET', ...options }),
  
  post: <T>(endpoint: string, data: unknown, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data), 
      ...options 
    }),
  
  put: <T>(endpoint: string, data: unknown, options?: RequestInit) => 
    apiRequest<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data), 
      ...options 
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) => 
    apiRequest<T>(endpoint, { method: 'DELETE', ...options }),

  // Special method for file uploads
  upload: <T>(endpoint: string, formData: FormData, options?: RequestInit) => {
    // Don't set content-type header when uploading files to allow browser to set it with boundary
    const uploadOptions = {
      method: 'POST',
      body: formData,
      ...options,
    };
    
    return apiRequest<T>(endpoint, uploadOptions);
  }
};
