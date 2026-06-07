import { useCallback, useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '../../services/admin';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: 'blogs' | 'news';
  label?: string;
}

export function ImageUpload({ value, onChange, folder, label = 'Featured Image' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Max file size is 5MB');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="image-upload">
      <label className="admin-label">{label}</label>
      {value ? (
        <div className="image-preview">
          <img src={value} alt="Preview" />
          <button
            type="button"
            className="image-remove"
            onClick={() => onChange('')}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          className={`image-dropzone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <p>Uploading...</p>
          ) : (
            <>
              <ImageIcon size={32} />
              <p>Drag & drop or click to upload</p>
              <span>Max 5MB (JPG, PNG, WebP)</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onInputChange}
            style={{ display: 'none' }}
          />
        </div>
      )}
      {error && <p className="image-error">{error}</p>}
    </div>
  );
}
