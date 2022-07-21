import localforage from "localforage";
import { v4 } from "uuid";
import { STORAGE_KEY } from "./constants";
import { Photo, Storage } from "./types";

async function readStorage(): Promise<Storage> {
  let store = await localforage.getItem<Storage>(STORAGE_KEY);
  if (!store) {
    store = {
      folders: [
        {
          id: v4(),
          name: "Untitled Folder",
          photos: [],
        },
      ],
    };
    await localforage.setItem(STORAGE_KEY, store);
  }
  return store;
}

export async function getFolders() {
  const { folders } = await readStorage();
  return folders;
}

export async function getFolder(id: string) {
  const { folders } = await readStorage();
  const folder = folders.find((folder) => folder.id === id);
  if (!folder) throw new Error(`Folder ${id} not found`);
  return folder;
}

export async function addPhotoToFolder(base64: string, folderId: string) {
  const photo: Photo = {
    id: v4(),
    base64,
    folder: folderId,
  };
  const { folders } = await readStorage();
  const folder = folders.find((folder) => folder.id === folderId);
  if (!folder) {
    throw new Error(`Folder with id ${folderId} not found`);
  }
  folder.photos.push(photo);
  await localforage.setItem(STORAGE_KEY, { folders });
  return photo;
}
