'use client';

import { useState, useRef, useCallback } from 'react';

interface MediaUploaderProps {
  eventId: string;
  category: string; // hero, gallery, couple, music
  accept: string; // image/*, audio/*
  multiple?: boolean;
  maxFiles?: number;
  value: string | string[]; // current URL(s)
  onChange: (urls: string | string[]) => void;
  label?: string;
}

export default function MediaUploader({
  eventId,
  category,
  accept,
  multiple = false,
  maxFiles = 1,
  value,
  onChange,
  label,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', eventId);
    formData.append('category', category);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Error al subir');
    }
    return (await res.json()).url as string;
  }, [eventId, category]);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const remaining = maxFiles - urls.length;
    const toUpload = fileArray.slice(0, remaining);

    if (toUpload.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < toUpload.length; i++) {
        const url = await uploadFile(toUpload[i]);
        newUrls.push(url);
        setProgress(Math.round(((i + 1) / toUpload.length) * 100));
      }

      if (multiple) {
        onChange([...urls, ...newUrls]);
      } else {
        onChange(newUrls[0]);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [urls, maxFiles, multiple, onChange, uploadFile]);

  const handleDelete = useCallback(async (url: string) => {
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch {
      // ignore delete errors
    }

    if (multiple) {
      onChange(urls.filter(u => u !== url));
    } else {
      onChange('');
    }
  }, [urls, multiple, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const isImage = accept.includes('image');

  return (
    <div className="media-uploader">
      {label && <label className="media-uploader-label">{label}</label>}

      {/* Drop zone */}
      <div
        className={`media-drop-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {uploading ? (
          <div className="upload-progress">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span>Subiendo... {progress}%</span>
          </div>
        ) : (
          <div className="drop-text">
            <span className="drop-icon">📁</span>
            <span>{urls.length >= maxFiles ? 'Límite alcanzado' : 'Arrastra archivos aquí o haz clic'}</span>
            {multiple && <span className="drop-hint">{urls.length}/{maxFiles} archivos</span>}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />

      {/* Preview grid */}
      {urls.length > 0 && (
        <div className="media-preview-grid">
          {urls.map((url, i) => (
            <div key={i} className="media-preview-item">
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt={`Upload ${i + 1}`} />
              ) : (
                <audio controls src={url} />
              )}
              <button
                className="media-delete-btn"
                onClick={() => handleDelete(url)}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
