import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImage from "./ResizableImage";

export const ResizableImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element: HTMLElement) => element.style.width || element.getAttribute("width") || "100%",
        renderHTML: (attributes: { width?: string }) => {
          const styles: string[] = [];
          if (attributes.width) styles.push(`width: ${attributes.width}`);
          return { style: styles.join("; ") };
        },
      },
      float: {
        default: "none",
        parseHTML: (element: HTMLElement) => element.style.float || element.getAttribute("data-float") || "none",
        renderHTML: (attributes: { float?: string }) => {
          const f = attributes.float || "none";
          if (f === "none") return { "data-float": "none" };
          const margin = f === "left" ? "margin: 8px 16px 8px 0" : "margin: 8px 0 8px 16px";
          return {
            "data-float": f,
            style: `float: ${f}; ${margin}`,
          };
        },
      },
      align: {
        default: "center",
        parseHTML: (element: HTMLElement) => element.getAttribute("data-align") || "center",
        renderHTML: (attributes: { align?: string; float?: string }) => {
          if (attributes.float && attributes.float !== "none") return {};
          const a = attributes.align || "center";
          let margin = "margin-left: auto; margin-right: auto";
          if (a === "left") margin = "margin-right: auto; margin-left: 0";
          if (a === "right") margin = "margin-left: auto; margin-right: 0";
          return { "data-align": a, style: margin };
        },
      },
    };
  },

  // Allow inline display for float to work with surrounding text
  inline: false,
  group: "block",

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage);
  },
});
