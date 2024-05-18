import React from "react";

const Modal = ({
  children,
  visible,
  setVisible,
}: {
  children: React.ReactNode;
  visible: boolean;
  setVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    visible && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/80 bg-opacity-50 z-40">
        <div className="transparent max-w-md w-full">
          <div className="mt-4">{children}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
