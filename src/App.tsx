import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import { Folder } from "./components/Folder";
import { Image } from "./components/Image";
import { Nav } from "./components/Nav";
import { getFolders, movePhotoToFolder } from "./storage";
import { Photo } from "./types";

function App() {
  const foldersQuery = useQuery(["folders"], getFolders);
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    ({
      photoId,
      prevFolderId,
      folderId,
    }: {
      photoId: string;
      prevFolderId: string;
      folderId: string;
    }) => movePhotoToFolder(photoId, prevFolderId, folderId)
  );

  if (!foldersQuery.isSuccess) {
    return null;
  }

  const handleDragStart = (evt: DragStartEvent) => {
    setActivePhoto(evt.active.data.current as Photo);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active.id || !over?.id) {
      return;
    }

    const photoId = active.id as string;
    const prevFolderId = (active.data.current as Photo).folder;
    const folderId = over.id as string;

    mutation.mutate(
      { photoId, prevFolderId, folderId },
      {
        onSuccess() {
          queryClient.invalidateQueries(["folder", prevFolderId]);
          queryClient.invalidateQueries(["folder", folderId]);
        },
      }
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Router>
        <Nav folders={foldersQuery.data} />
        <main>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={`/${foldersQuery.data[0].id}`} replace />}
            />
            <Route path="/:folderId" element={<Folder />} />
          </Routes>
        </main>
      </Router>
      <DragOverlay>
        {activePhoto && <Image photo={activePhoto} isDraggingOverlay />}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
