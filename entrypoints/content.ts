// Importing necessary assets (icons) for the extension UI
import openPopUpIcon from "~/assets/open-popup-icon.svg";
import insertIcon from "~/assets/insert-icon.svg";
import generateIcon from "~/assets/generate-icon.svg";
import regenerateIcon from "~/assets/regenerate-icon.svg";
import "./popup/style.css";

export default defineContentScript({
  matches: ["*://*.linkedin.com/*"],
  main() {
    // *********************************************** Popup Model ****************************************************
    const popUpModel = `
    <div id="custom-modal" class="hidden">
      <div id="modal-content" class="bg-white rounded-lg w-full h-fit max-w-3xl p-5">
        <div id="messages" class="hidden"></div>
        <div class="mb-2">
          <input id="input-text" type="text" placeholder="Your prompt" class="w-full p-2 border border-gray-300 rounded-md"/>
        </div>
        <div class="flex justify-end items-center text-right mt-3">
          <button id="insert-btn" class="border-2 hidden">
            <img src="${insertIcon}" alt="Insert" class="mr-1 w-5 h-5">
            <b>Insert</b>
          </button>
          <button id="generate-btn" class="bg-blue-500 text-white px-4 py-2 border-2 border-blue-500 rounded-md cursor-pointer flex gap-2 items-center">
            <img src="${generateIcon}" alt="Generate" class="mr-1 w-5 h-5">
            <b class="">Generate</b>
          </button>
        </div>
      </div>
    </div>
  `;

    // *********************************************** Adding Popup Model at End ****************************************************
    document.body.insertAdjacentHTML("beforeend", popUpModel);

    // *********************************************** Giving specific id to each element for or quick access ****************************************************
    const modal = document.getElementById("custom-modal") as HTMLDivElement;
    const generateBtn = document.getElementById(
      "generate-btn"
    ) as HTMLButtonElement;
    const insertBtn = document.getElementById(
      "insert-btn"
    ) as HTMLButtonElement;
    const inputText = document.getElementById("input-text") as HTMLInputElement;
    const messagesDiv = document.getElementById("messages") as HTMLDivElement;

    // *********************************************** Need store last generated msg for later use ****************************************************
    let lastGeneratedMessage = "";
    let parentElement: HTMLElement | null = null;

    // *********************************************** Show Popup icon on textarea click or focused ****************************************************
    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // ***********************************************Check clicked element class****************************************************
      if (
        target.matches(".msg-form__contenteditable") ||
        target.closest(".msg-form__contenteditable")
      ) {
        // ***********************************************Store parent element as well****************************************************
        parentElement =
          target.closest(".msg-form__container") ||
          target.closest(".msg-form__contenteditable");

        const contentContainer = parentElement?.closest(
          ".msg-form_msg-content-container"
        );

        // *********************************************** message textarea is active or focused ****************************************************
        if (parentElement && contentContainer) {
          contentContainer.classList.add(
            "msg-form_msg-content-container--is-active"
          );
          parentElement.setAttribute("data-artdeco-is-focused", "true");
        }

        // *********************************************** inject popup icon ****************************************************
        if (parentElement && !parentElement.querySelector(".open-popup-icon")) {
          parentElement.style.position = "relative";

          const icon = document.createElement("img");
          icon.className =
            "open-popup-icon absolute bg-white rounded-full p-2 m-2 bottom-1 right-1 w-8 h-8 cursor-pointer z-50 rounded-full shadow-md";
          icon.src = openPopUpIcon;
          icon.alt = "Popup Icon";
          parentElement.appendChild(icon);

          // *********************************************** Open model on poup icon click ****************************************************
          icon.addEventListener("click", (e) => {
            e.stopPropagation();
            modal.className =
              "fixed inset-0 bg-black bg-opacity-50 flex justify-center mx-auto items-center z-40";
          });
        }
      }
    });

    // *********************************************** default message ****************************************************
    const generateMessage = () => {
      const messages = [
        "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.",
      ];
      return messages[0]; // add static msg every time
    };

    // *********************************************** check generate button click ****************************************************

    generateBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // stop event bubbling

      // *********************************************** add user input values ****************************************************

      const inputValue = inputText.value.trim();
      if (!inputValue) return;

      // *********************************************** Display user messages ****************************************************
      const userMessageDiv = document.createElement("div");
      userMessageDiv.textContent = inputValue;
      userMessageDiv.className =
        "bg-[#DFE1E7] text-gray-600 rounded-xl p-2 my-2 text-right max-w-[80%] self-end ml-auto";
      messagesDiv.className = "max-h-96 overflow-y-auto p-2 my-2 flex flex-col";
      messagesDiv.appendChild(userMessageDiv);

      // *********************************************** after clicking generate btn disable it and show loading ****************************************************
      generateBtn.disabled = true;
      generateBtn.textContent = "Loading...";
      generateBtn.classList.add("bg-gray-600");

      // *********************************************** set timeout for the each msg genration ****************************************************
      setTimeout(() => {
        lastGeneratedMessage = generateMessage();
        const generatedMessageDiv = document.createElement("div");
        generatedMessageDiv.textContent = lastGeneratedMessage;
        generatedMessageDiv.className =
          "bg-[#DBEAFE] text-gray-600 rounded-xl p-2 mb-1 text-left max-w-[80%] self-start mr-auto";

        // *********************************************** Add last genrated message ****************************************************
        messagesDiv.appendChild(generatedMessageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        // *********************************************** after message genration change btn text to regenrate ****************************************************
        generateBtn.disabled = false;
        generateBtn.classList.remove("bg-gray-600");
        generateBtn.classList.add("bg-blue-500");
        generateBtn.innerHTML = `<img src="${regenerateIcon}" alt="Regenerate" class="mr-1 w-5 h-5"> <b>Regenerate</b>`;

        // *********************************************** empty input field ****************************************************
        inputText.value = "";
        insertBtn.className =
          "bg-white text-gray-500 px-4 py-2 border border-gray-500 rounded-md cursor-pointer mr-2 flex gap-2 items-center";
      }, 500);
    });

    // *********************************************** after msg generated shobtn insert ****************************************************
    insertBtn.addEventListener("click", () => {
      if (lastGeneratedMessage && parentElement) {
        // Remove aria-label to solve screen reader issues
        parentElement.removeAttribute("aria-label");

        // *********************************************** Select <p> inside the contentedible area ****************************************************
        let existingParagraph = parentElement.querySelector("p");

        if (!existingParagraph) {
          existingParagraph = document.createElement("p");
          parentElement.appendChild(existingParagraph);
        }

        // *********************************************** clear old and add new msg ****************************************************
        existingParagraph.textContent = lastGeneratedMessage;

        // *********************************************** after inserting the msg hide the insert btn ****************************************************
        insertBtn.classList.add("hidden");
        modal.classList.add("hidden");
      }

      const placeholderElement = document.querySelector(
        ".msg-form__placeholder"
      );
      if (placeholderElement) {
        placeholderElement.remove();
      }

      // const sendButton = document.querySelector(
      //   ".msg-form__send-button"
      // ) as HTMLButtonElement;
      // if (sendButton) {
      //   sendButton.disabled = false; // Enable the button
      //   sendButton.classList.remove("disabled"); // Optionally remove any 'disabled' class if applied
      // }
    });

    // *********************************************** need to maintain focus otherwise the icon removed ****************************************************
    const inputElements = [inputText, generateBtn, insertBtn];
    inputElements.forEach((element) => {
      element.addEventListener("focus", () => {
        if (parentElement) {
          parentElement.setAttribute("data-artdeco-is-focused", "true");
        }
      });
    });

    // *********************************************** close modal on outside click ****************************************************
    document.addEventListener("click", (event: MouseEvent) => {
      console.log("outside clicked");
      // const target = event.target as HTMLElement;
      // if (
      //   modal.className ===
      //     "fixed inset-0 bg-black bg-opacity-50 flex justify-center mx-auto items-center z-40" &&
      //   !modal.contains(target)
      // ) {
      //   modal.className = "hidden";
      // }
    });
  },
});
