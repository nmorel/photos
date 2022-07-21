import { useDraggable } from "@dnd-kit/core";
import { Photo } from "../../types";
import "./Image.css";

export function Image({
  photo,
  isDraggingOverlay = false,
}: {
  photo: Photo;
  isDraggingOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: photo.id,
    data: photo,
  });
  return (
    <div
      ref={setNodeRef}
      className="image-container"
      style={isDraggingOverlay ? { opacity: 0.5, transform: "scale(0.5)" } : {}}
      {...listeners}
      {...attributes}
    >
      <img src={photo.base64} />
    </div>
  );
}
