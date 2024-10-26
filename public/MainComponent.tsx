import React, { useEffect, useState } from "react";
import openPopUpIcon from "~/assets/open-popup-icon.svg";
import PopupModal from "./PopupModal";

const MainComponent = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement;

      if (
        target.matches(".msg-form__contenteditable") ||
        target.closest(".msg-form__contenteditable")
      ) {
        const newParentElement = (target.closest(".msg-form__container") ||
          target.closest(".msg-form__contenteditable")) as HTMLElement;

        if (newParentElement) {
          const contentContainer = newParentElement.closest(
            ".msg-form_msg-content-container"
          );

          contentContainer?.classList.add(
            "msg-form_msg-content-container--is-active"
          );
          newParentElement.setAttribute("data-artdeco-is-focused", "true");

          setParentElement(newParentElement);
          injectPopupIcon(newParentElement);
        }
      }
    };

    const handleBlur = () => {
      if (parentElement) {
        const contentContainer = parentElement.closest(
          ".msg-form_msg-content-container"
        );
        contentContainer?.classList.remove(
          "msg-form_msg-content-container--is-active"
        );
        parentElement.removeAttribute("data-artdeco-is-focused");
        removePopupIcon();
        setParentElement(null);
      }
    };

    const injectPopupIcon = (parent: HTMLElement) => {
      if (!parent.querySelector(".open-popup-icon")) {
        const container = document.createElement("div");
        container.className = "open-popup";
        container.setAttribute(
          "style",
          "position: absolute; bottom: 1rem; right: 1rem; z-index: 10000; background-color: white; border-radius: 9999px; box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); padding: 5px;"
        );

        const icon = document.createElement("img");
        icon.className = "open-popup-icon w-8 h-8 cursor-pointer";
        icon.src = openPopUpIcon;
        icon.alt = "Popup Icon";
        container.appendChild(icon);
        parent.appendChild(container);

        icon.addEventListener("click", (e) => {
          e.stopPropagation();
          setShowModal(true);
        });
      }
    };

    const removePopupIcon = () => {
      if (parentElement) {
        const icon = parentElement.querySelector(".open-popup");
        if (icon) {
          icon.remove();
        }
      }
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, [showModal, parentElement]);

  return showModal ? (
    <PopupModal
      isOpen={showModal}
      setIsOpen={setShowModal}
      parentElement={parentElement}
    />
  ) : null;
};

export default MainComponent;
