import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMenuModal } from "./MenuModalContext";
import "../../css/components/Modal/Menu.css";
import File from "../../components/File";
import axios from 'axios';

function MenuModal({ restId, onSuccess }) {
  const { menumodalState, closeMenuModal } = useMenuModal();
  const { show, header, menuname, menuprice, menuId, menuPhoto } = menumodalState;

  const [nameInput, setNameInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setNameInput(menumodalState.menuname);
    setPriceInput(menumodalState.menuprice);
  }, [menumodalState]);

  const handleMenuNameChange = (e) => {
    setNameInput(e.target.value);
  };

  const handleMenuPriceChange = (e) => {
    setPriceInput(e.target.value);
  };

  const handleConfirm = useCallback(async () => {
    const file = fileInputRef.current.getFile();

    setUploading(true);
    const formData = new FormData();

    if (menuId) {
      // 메뉴 수정 요청
      formData.append('menuData', JSON.stringify({
        menuPrice: priceInput,
        menuPhoto: file ? undefined : menumodalState.menuPhoto, // 기존 사진 사용
      }));
      if (file) {
        formData.append('file', file);
      }
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_URI}/api/restaurants/menu/${menuId}`, formData, {

          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Menu updated successfully with ID:', response.data);
      } catch (error) {
        console.error('Error updating menu:', error);
        setUploadError(error);
      }
    } else {
      // 메뉴 추가 요청
      formData.append('menuData', JSON.stringify({
        restId,
        menuName: nameInput,
        menuPrice: priceInput,
      }));
      if (file) {
        formData.append('file', file);
      }
      try {
        const response = await axios.post('${process.env.REACT_APP_API_URI}/api/restaurants/menu', formData, {

          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Menu added successfully with ID:', response.data);
      } catch (error) {
        console.error('Error adding menu:', error);
        setUploadError(error);
      }
    }

    setUploading(false);
    closeMenuModal();
    onSuccess();
  }, [nameInput, priceInput, menuId, restId, closeMenuModal, onSuccess, menumodalState.menuPhoto]);

  const handleCancel = () => {
    setNameInput('');
    setPriceInput('');
    if (fileInputRef.current) {
      fileInputRef.current.reset();
    }
    closeMenuModal();
  };

  return (
    <div>
      <div
        id={show ? "menubackgroundon" : "menubackgroundoff"}
        onClick={(e) => {
          if (
            e.target.id === "menubackgroundon" ||
            e.target.id === "menubackgroundoff"
          ) {
            handleCancel();
          }
        }}
      >
        <div className={`menuModal ${show ? "menushow" : "menuhide"}`}>
          <div className="menuModalContent">
            <div className="menuboldText">{header}</div>
            <input
              className='menu-name-input'
              type='text'
              placeholder='메뉴 이름'
              value={nameInput}
              onChange={handleMenuNameChange}
              disabled={menuId != null}
            />
            <input
              className='menu-price-input'
              type='text'
              placeholder='15,000원'
              value={priceInput}
              onChange={handleMenuPriceChange}
            />
            <div className='descriptionalign'>
              <div className='menudescription'>메뉴 사진은 한 장만 등록 가능합니다.</div>
            </div>
            <div className='menu-modal-file-wrapper'>
              <File ref={fileInputRef} />
            </div>
            <button className="MenuCheckModalBtn" onClick={handleConfirm}>확인</button>
            <button className="MenucancelModalBtn" onClick={handleCancel}>취소</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuModal;