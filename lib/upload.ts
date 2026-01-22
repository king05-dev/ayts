// Upload utility for AYTS frontend
import { useState } from 'react';

export interface UploadOptions {
  file: File;
  entityType?: 'product' | 'store' | 'vendor' | 'category' | 'user' | 'document' | 'upload';
  entityTable?: string;
  entityId?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  file?: {
    id: string;
    filename: string;
    originalFilename: string;
    size: number;
    type: string;
    extension: string;
    publicUrl: string;
    downloadUrl: string;
    entityType: string;
    entityId: string;
    createdAt: string;
  };
  error?: string;
}

export class UploadService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://ayts-api.jerquinbayudo.workers.dev') {
    this.baseUrl = baseUrl;
  }

  async uploadFile(options: UploadOptions): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', options.file);
      
      if (options.entityType) {
        formData.append('entity_type', options.entityType);
      }
      
      if (options.entityTable) {
        formData.append('entity_table', options.entityTable);
      }
      
      if (options.entityId) {
        formData.append('entity_id', options.entityId);
      }

      const response = await fetch(`${this.baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.error || 'Upload failed',
          error: data.error || 'Unknown error',
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error during upload',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getFilesByEntity(entityType: string, entityId: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/upload/entity/${entityType}/${entityId}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch files');
      }
      
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/upload/${fileId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      return response.ok && data.success;
    } catch (error) {
      return false;
    }
  }

  getFileUrl(fileKey: string): string {
    return `${this.baseUrl}/api/upload/files/${fileKey}`;
  }

  getDownloadUrl(fileId: string): string {
    return `${this.baseUrl}/api/upload/download/${fileId}`;
  }
}

// Export singleton instance
export const uploadService = new UploadService();

// Helper function to validate file before upload
export function validateFile(file: File, maxSize: number = 10 * 1024 * 1024): string | null {
  // Check file size
  if (file.size > maxSize) {
    return `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`;
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    return 'File type not supported. Allowed types: images, PDF, and documents';
  }

  return null;
}

// React hook for file uploads
export function useFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (options: UploadOptions): Promise<UploadResponse | null> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Validate file
      const validationError = validateFile(options.file);
      if (validationError) {
        setError(validationError);
        return null;
      }

      setProgress(25);

      const result = await uploadService.uploadFile(options);
      setProgress(100);

      if (!result.success) {
        setError(result.error || 'Upload failed');
        return null;
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setUploading(false);
    setProgress(0);
    setError(null);
  };

  return {
    uploadFile,
    uploading,
    progress,
    error,
    reset,
  };
}
