import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Folder } from "./components/Folder/Folder";
import { getFolders, movePhotoToFolder } from "./storage";
import { Nav } from "./components/Nav";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { Photo } from "./types";
import { Image } from "./components/Image";

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
