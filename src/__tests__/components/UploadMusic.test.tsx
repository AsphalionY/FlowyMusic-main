import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, jest } from '@jest/globals';
import UploadMusic from '@/components/UploadMusic';

// Mock the useUploadMusic hook
jest.mock('@/components/upload/useUploadMusic', () => ({
  useUploadMusic: () => ({
    isAuthenticated: true,
    user: { username: 'testuser' },
    selectedFile: null,
    isUploading: false,
    uploadProgress: 0,
    title: '',
    redirectToLogin: jest.fn(),
    handleFileSelected: jest.fn(),
    removeFile: jest.fn(),
    handleTitleChange: jest.fn(),
    handleSubmit: jest.fn(),
  }),
}));

// Mock child components
jest.mock('@/components/upload/AuthRequired', () => ({
  __esModule: true,
  default: () => <div data-testid="auth-required">Auth Required</div>,
}));

jest.mock('@/components/upload/FileDropzone', () => ({
  __esModule: true,
  default: ({ onFileSelected }: { onFileSelected: (file: File) => void }) => (
    <button
      data-testid="file-dropzone"
      onClick={() => onFileSelected(new File([], 'test.mp3'))}
      aria-label="Sélectionner un fichier"
      type="button"
    >
      File Dropzone
    </button>
  ),
}));

jest.mock('@/components/upload/FileDetails', () => ({
  __esModule: true,
  default: ({
    title,
    onTitleChange,
    onRemoveFile,
  }: {
    title: string;
    onTitleChange: (title: string) => void;
    onRemoveFile: () => void;
  }) => (
    <div data-testid="file-details">
      <input
        type="text"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        data-testid="title-input"
      />
      <button onClick={onRemoveFile} data-testid="remove-file">
        Remove File
      </button>
    </div>
  ),
}));

describe('UploadMusic Component', () => {
  it('renders the upload form when authenticated', async () => {
    render(<UploadMusic />);

    expect(screen.getByText('Ajouter une musique')).toBeInTheDocument();
    expect(screen.getByTestId('file-dropzone')).toBeInTheDocument();
  });

  it('renders auth required message when not authenticated', async () => {
    jest
      .spyOn(require('@/components/upload/useUploadMusic'), 'useUploadMusic')
      .mockImplementation(() => ({
        ...require('@/components/upload/useUploadMusic').useUploadMusic(),
        isAuthenticated: false,
      }));

    render(<UploadMusic />);

    expect(screen.getByTestId('auth-required')).toBeInTheDocument();
  });

  it('shows file details after file selection', async () => {
    render(<UploadMusic />);

    fireEvent.click(screen.getByTestId('file-dropzone'));

    expect(screen.getByTestId('file-details')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('remove-file')).toBeInTheDocument();
  });
});
