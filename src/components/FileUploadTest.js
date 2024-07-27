import React, { useRef, useState } from 'react';
import File from './File'; // File 컴포넌트를 적절한 경로에서 임포트합니다.

const FileUploadTest = () => {
  const fileRef = useRef(null);
  const [uploadUrl, setUploadUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (file) => {
    console.log('Selected file:', file);
  };

  const handleUploadSuccess = (url) => {
    setUploadUrl(url);
    console.log('File uploaded successfully. URL:', url);
  };

  const handleUploadError = (error) => {
    setError(error.message);
    console.error('File upload failed:', error);
  };

  const handleUploadClick = () => {
    if (fileRef.current) {
      fileRef.current.upload(); // 업로드 시작
    }
  };

  return (
    <div>
      <h2>File Upload Test</h2>
      <File
        ref={fileRef}
        onFileChange={handleFileChange}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
      />
      <button onClick={handleUploadClick}>Upload File</button>
      {uploadUrl && <div>Uploaded File URL: <a href={uploadUrl} target="_blank" rel="noopener noreferrer">{uploadUrl}</a></div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
    </div>
  );
};

export default FileUploadTest;