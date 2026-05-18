"use client";

import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useState, useRef, useCallback } from "react";
import { Move, Maximize2, AlignLeft, AlignCenter, AlignRight, Columns2 } from "lucide-react";

export default function ResizableImage({ node, updateAttributes, selected }: NodeViewProps) {
  const [isResizing, setIsResizing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const startPos = useRef({ x: 0, y: 0, width: 0 });

  const width = node.attrs.width || "100%";
  const float = node.attrs.float || "none"; // none, left, right
  const align = node.attrs.align || "center";

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      const img = imgRef.current;
      if (!img) return;

      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        width: img.offsetWidth,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const diff = moveEvent.clientX - startPos.current.x;
        const newWidth = Math.max(80, startPos.current.width + diff);
        updateAttributes({ width: `${newWidth}px` });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [updateAttributes]
  );

  const setSize = (size: string) => {
    updateAttributes({ width: size });
  };

  const setFloat = (f: string) => {
    updateAttributes({ float: f, align: f === "none" ? align : f });
  };

  // Determine wrapper styles based on float
  let wrapperStyle: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    maxWidth: "100%",
  };

  let wrapperClass = "relative group my-4";

  if (float === "left") {
    wrapperStyle = { ...wrapperStyle, float: "left", marginRight: "16px", marginBottom: "8px" };
    wrapperClass += " clear-none";
  } else if (float === "right") {
    wrapperStyle = { ...wrapperStyle, float: "right", marginLeft: "16px", marginBottom: "8px" };
    wrapperClass += " clear-none";
  } else {
    // No float - use alignment
    if (align === "left") wrapperClass += " mr-auto";
    else if (align === "right") wrapperClass += " ml-auto";
    else wrapperClass += " mx-auto";
  }

  return (
    <NodeViewWrapper
      className={wrapperClass}
      style={wrapperStyle}
      draggable
      data-drag-handle
    >
      {/* Image */}
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ""}
        className={`w-full h-auto rounded-lg transition-shadow duration-200 ${
          selected ? "ring-2 ring-blue-500 shadow-lg" : "hover:shadow-md"
        } ${isResizing ? "pointer-events-none select-none" : ""}`}
        draggable={false}
      />

      {/* Drag handle */}
      <div
        className={`absolute top-2 left-2 p-1.5 bg-black/60 text-white rounded-md cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity ${
          selected ? "opacity-100" : ""
        }`}
        contentEditable={false}
        draggable
        data-drag-handle
        title="Kéo để di chuyển"
      >
        <Move size={14} />
      </div>

      {/* Toolbar */}
      <div
        className={`absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-gray-900 rounded-lg p-1 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity ${
          selected ? "opacity-100" : ""
        }`}
        contentEditable={false}
      >
        {/* Size buttons */}
        <button type="button" onClick={() => setSize("25%")} className="px-1.5 py-1 text-white text-[10px] rounded hover:bg-white/20" title="25%">25</button>
        <button type="button" onClick={() => setSize("33%")} className="px-1.5 py-1 text-white text-[10px] rounded hover:bg-white/20" title="33%">33</button>
        <button type="button" onClick={() => setSize("50%")} className="px-1.5 py-1 text-white text-[10px] rounded hover:bg-white/20" title="50%">50</button>
        <button type="button" onClick={() => setSize("75%")} className="px-1.5 py-1 text-white text-[10px] rounded hover:bg-white/20" title="75%">75</button>
        <button type="button" onClick={() => setSize("100%")} className="px-1.5 py-1 text-white rounded hover:bg-white/20" title="100%"><Maximize2 size={11} /></button>

        <div className="w-px h-4 bg-white/30 mx-0.5" />

        {/* Float / Align buttons */}
        <button
          type="button"
          onClick={() => setFloat("left")}
          className={`p-1.5 rounded ${float === "left" ? "bg-blue-500 text-white" : "text-white/70 hover:bg-white/20"}`}
          title="Float trái (chữ bao quanh bên phải)"
        >
          <AlignLeft size={12} />
        </button>
        <button
          type="button"
          onClick={() => setFloat("none")}
          className={`p-1.5 rounded ${float === "none" ? "bg-blue-500 text-white" : "text-white/70 hover:bg-white/20"}`}
          title="Không float (block)"
        >
          <AlignCenter size={12} />
        </button>
        <button
          type="button"
          onClick={() => setFloat("right")}
          className={`p-1.5 rounded ${float === "right" ? "bg-blue-500 text-white" : "text-white/70 hover:bg-white/20"}`}
          title="Float phải (chữ bao quanh bên trái)"
        >
          <AlignRight size={12} />
        </button>
        <button
          type="button"
          onClick={() => { setFloat("left"); setSize("40%"); }}
          className="p-1.5 text-white/70 rounded hover:bg-white/20"
          title="Ảnh nhỏ bên trái + chữ bao quanh"
        >
          <Columns2 size={12} />
        </button>
      </div>

      {/* Resize handle - right */}
      <div
        className={`absolute top-1/2 -right-1.5 w-3 h-10 -translate-y-1/2 bg-blue-500 rounded-full cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 ${
          selected ? "opacity-100" : ""
        }`}
        onMouseDown={handleMouseDown}
        contentEditable={false}
      />
      {/* Resize handle - bottom-right */}
      <div
        className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 ${
          selected ? "opacity-100" : ""
        }`}
        onMouseDown={handleMouseDown}
        contentEditable={false}
      />

      {/* Float indicator */}
      {float !== "none" && (
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-blue-500/80 text-white text-[10px] rounded-full">
          float {float}
        </div>
      )}

      {/* Size indicator while resizing */}
      {isResizing && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/70 text-white text-xs rounded">
          {width}
        </div>
      )}
    </NodeViewWrapper>
  );
}
