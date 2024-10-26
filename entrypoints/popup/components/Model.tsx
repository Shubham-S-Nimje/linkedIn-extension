import React from "react";
import insertIcon from "/insert-icon.svg";
import generateIcon from "/generate-icon.svg";

interface ModalProps {
  onGenerate: () => void;
  onInsert: () => void;
}

const Modal: React.FC<ModalProps> = ({ onGenerate, onInsert }) => {
  return (
    <div id="custom-modal" className="hidden">
      <div className="bg-white rounded-lg w-full h-fit max-w-3xl p-5">
        <div id="messages" className="hidden"></div>
        <div className="mb-2">
          <input
            id="input-text"
            type="text"
            placeholder="Your prompt"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-end items-center text-right mt-3">
          <button
            onClick={onInsert}
            id="insert-btn"
            className="border-2 hidden"
          >
            <img src={insertIcon} alt="Insert" className="mr-1 w-5 h-5" />
            <b>Insert</b>
          </button>
          <button
            onClick={onGenerate}
            id="generate-btn"
            className="bg-blue-500 text-white px-4 py-2 border-2 border-blue-500 rounded-md cursor-pointer flex gap-2 items-center"
          >
            <img src={generateIcon} alt="Generate" className="mr-1 w-5 h-5" />
            <b>Generate</b>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
