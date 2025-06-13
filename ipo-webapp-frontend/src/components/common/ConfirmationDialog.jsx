import React from 'react';
import { RiCloseLine, RiAlertLine } from '@remixicon/react';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?", 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "warning" // warning, danger, info
}) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'danger':
        return 'text-red-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-300 dark:focus:ring-red-800';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 dark:focus:ring-blue-800';
      default:
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300 dark:focus:ring-yellow-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      {/* Dialog */}
      <div className="relative w-auto max-w-md mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none dark:bg-gray-800">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-200 dark:border-gray-600 rounded-t">
            <div className="flex items-center">
              <RiAlertLine size={24} className={`mr-3 ${getIconColor()}`} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            </div>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <RiCloseLine size={20} />
            </button>
          </div>
          
          {/* Body */}
          <div className="relative p-6 flex-auto">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {message}
            </p>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 dark:border-gray-600 rounded-b">
            <button
              className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              type="button"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className={`text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${getConfirmButtonColor()}`}
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;

