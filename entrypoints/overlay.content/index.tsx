import { defineContentScript } from "wxt/sandbox";
import { ContentScriptContext, createShadowRootUi } from "wxt/client";
import ReactDOM from "react-dom/client";
import MainComponent from "@/public/MainComponent";
import "./style.css";

export default defineContentScript({
  matches: ["https://www.linkedin.com/*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    const ui = await createUi(ctx);
    ui.mount();
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: "react-ui",
    position: "inline",
    onMount(container) {
      const app = document.createElement("div");
      container.append(app);

      const root = ReactDOM.createRoot(app);
      root.render(<MainComponent />);
      return root;
    },
    onRemove(root) {
      root?.unmount();
    },
  });
}
