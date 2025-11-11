import React from 'react';

interface SettingsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsGuideModal: React.FC<SettingsGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative w-[1280px] h-[800px]">
        <button
          onClick={onClose}
          className="absolute focus:outline-none"
          style={{ top: '20px', right: '40px', width: '48px', height: '48px' }}
          aria-label="Close settings guide"
        >
          <img src="/button/close.png" alt="Close" className="w-full h-full" />
        </button>

        <img
          src="/images/info.png"
          alt="Settings Guide"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default SettingsGuideModal;

