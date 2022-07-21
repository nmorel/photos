import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";
import { getFolder } from "../../storage";
import { ImageForm } from "../ImageForm";
import "./Folder.css";

export function Folder() {
  const { folderId } = useParams();
  const folderQuery = useQuery(["folder", folderId], () => {
    if (!folderId) return Promise.reject("No folderId");
    return getFolder(folderId);
  });

  if (folderQuery.isLoading) {
    return null;
  }

  if (folderQuery.isError) {
    return <Navigate to={"/"} replace />;
  }

  const folder = folderQuery.data;

  return (
    <>
      <h1>My photo collection - {folder.name}</h1>
      <ImageForm folder={folder} />
      <ul className="list">
        {folder.photos.map((photo) => (
          <li key={photo.id} className="list-item">
            <img src={photo.base64} />
          </li>
        ))}
      </ul>
    </>
  );
}
