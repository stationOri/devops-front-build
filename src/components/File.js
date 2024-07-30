import React, { useRef, useCallback, useImperativeHandle, forwardRef, useState } from "react";
import axios from 'axios';
import "../css/components/File.css";
import Loading from "./Loading";

const File = forwardRef(({ onFileChange, onUploadSuccess, onUploadError }, ref) => {
  const inputEl = useRef(null);
  const [fileName, setFileName] = useState("파일을 선택하세요.");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputHandler = useCallback((event) => {
    const files = event.target.files;
    if (files && files[0]) {
      setFileName(files[0].name);
      setFile(files[0]);
      if (onFileChange) {
        onFileChange(files[0]);
      }
    } else {
      if (onFileChange) {
        onFileChange(null);
      }
    }
  }, [onFileChange]);

  const uploadToServer = useCallback(async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URI}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (onUploadSuccess) {
        onUploadSuccess(response.data.url);
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  }, [file, onUploadSuccess, onUploadError]);

  useImperativeHandle(ref, () => ({
    getFile: () => file,
    reset: () => {
      setFileName("파일을 선택하세요.");
      setFile(null);
      if (inputEl.current) {
        inputEl.current.value = null;
      }
      if (onFileChange) {
        onFileChange(null);
      }
    },
    upload: uploadToServer
  }), [file, onFileChange, uploadToServer]);

  return (
    <div className="fileWrapper">
      <label htmlFor="file" className="contentFileWrapper">
        <div className="file-name">{fileName}</div>
        <div className="fileselect">파일 선택</div>
      </label>
      <input accept=".jpg,.jpeg,.png" type="file" id="file" ref={inputEl} className="file-input" onChange={fileInputHandler} />
      {/* {uploading && <Loading />} */}
    </div>
  );
});

export default File;