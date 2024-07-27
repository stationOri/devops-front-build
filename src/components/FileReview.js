import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import "../css/components/File.css";

const FileReview = forwardRef((props, ref) => {
  const inputEl = useRef(null);
  const [files, setFiles] = useState([]); // 선택한 파일들을 저장할 상태

  const fileInputHandler = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 3) {
      alert("최대 3개의 파일만 선택할 수 있습니다.");
      return;
    }
    setFiles(selectedFiles); // 상태에 파일 저장
  };

  useImperativeHandle(ref, () => ({
    getFiles: () => files, // 선택한 파일들을 반환하는 메서드
    reset: () => {
      setFiles([]);
      if (inputEl.current) {
        inputEl.current.value = null;
      }
    }
  }), [files]);

  return (
    <div className="fileWrapper">
      <label htmlFor="file" className="contentFileWrapper">
        <div className="file-name">
          {files.length === 0 ? "파일을 선택하세요." : files.map(file => file.name).join(', ')}
        </div>
        <div className="fileselect">파일 선택</div>
      </label>
      <input
        accept=".jpg,.jpeg,.png"
        type="file"
        id="file"
        ref={inputEl}
        className="file-input"
        multiple
        onChange={fileInputHandler}
      />
    </div>
  );
});

export default FileReview;
