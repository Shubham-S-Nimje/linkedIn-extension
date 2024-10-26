import React, { useState, useEffect } from "react";
import insertIcon from "~/assets/insert-icon.svg";
import generateIcon from "~/assets/generate-icon.svg";
import regenerateIcon from "~/assets/regenerate-icon.svg";

interface PopupModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  parentElement: HTMLElement | null;
}

const PopupModal: React.FC<PopupModalProps> = ({
  isOpen,
  setIsOpen,
  parentElement,
}) => {
  const [userInput, setUserInput] = useState("");
  const [lastGeneratedMessage, setLastGeneratedMessage] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );

  const generateMessage = () => {
    return "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
  };

  const handleGenerate = () => {
    if (!userInput.trim()) return;

    const userMessage = { text: userInput, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setIsGenerated(true);

    setTimeout(() => {
      const generatedText = generateMessage();
      const generatedMessage = { text: generatedText, isUser: false };
      setMessages((prev) => [...prev, generatedMessage]);
      setLastGeneratedMessage(generatedText);
      setUserInput("");
    }, 500);
  };

  const handleInsert = () => {
    console.log(lastGeneratedMessage);

    if (lastGeneratedMessage) {
      const messageBox = document.querySelector(
        ".msg-form__contenteditable"
      ) as HTMLElement;

      if (messageBox) {
        const textarea_msg = document.querySelector(".msg-form__placeholder");
        textarea_msg?.setAttribute("style", "display: none");
        messageBox.ariaLabel = "";
        messageBox.children[0].innerHTML = lastGeneratedMessage;

        // messageBox.focus();
        // document.execCommand("insertText", false, lastGeneratedMessage);

        setIsOpen(false);
        setMessages([]);
        setLastGeneratedMessage("");
        setIsGenerated(false);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setUserInput("");
      setMessages([]);
      setLastGeneratedMessage("");
      setIsGenerated(false);
    }
  }, [isOpen]);

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-5">
        {messages.length > 0 && (
          <div className="max-h-96 overflow-y-auto p-2 flex flex-col my-4 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl max-w-[80%] ${
                  msg.isUser
                    ? "bg-[#DFE1E7] text-gray-500 rounded-xl p-2 my-2 self-end text-right"
                    : "bg-[#DBEAFE] self-start text-gray-500 rounded-xl p-2 mb-1 "
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        )}
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Your prompt"
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
        />
        <div className="flex justify-end gap-2 items-center space-x-2 mt-3">
          {messages.length > 0 && (
            <button
              onClick={handleInsert}
              disabled={!lastGeneratedMessage}
              className={`border-2 ${
                lastGeneratedMessage ? "border-gray-500" : "border-gray-500"
              } text-gray-500 px-4 py-2 border font-semibold rounded-md flex gap-2 items-center`}
            >
              <img src={insertIcon} alt="Insert" className="mr-1 w-5 h-5" />
              <span className="font-bold">Insert</span>
            </button>
          )}
          <button
            onClick={handleGenerate}
            className="bg-blue-500 text-white px-4 py-2 border-2 border-blue-500 rounded-md flex gap-2 items-center"
          >
            <img
              src={isGenerated ? regenerateIcon : generateIcon}
              alt="Generate"
              className="mr-1 w-5 h-5"
            />
            <span className="font-semibold">
              {isGenerated ? "Regenerate" : "Generate"}
            </span>
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default PopupModal;
