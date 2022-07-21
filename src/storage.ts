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

export async function addFolder(name: string) {
  const { folders } = await readStorage();
  const folder = {
    id: v4(),
    name,
    photos: [],
  };
  folders.push(folder);
  await localforage.setItem(STORAGE_KEY, { folders });
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

export async function movePhotoToFolder(
  photoId: string,
  prevFolderId: string,
  folderId: string
) {
  const { folders } = await readStorage();
  const prevFolder = folders.find((folder) => folder.id === prevFolderId);
  if (!prevFolder) {
    throw new Error(`Previous folder with id ${folderId} not found`);
  }
  const photo = prevFolder.photos.find((photo) => photo.id === photoId);
  if (!photo) {
    throw new Error(`Photo with id ${photoId} not found`);
  }
  const folder = folders.find((folder) => folder.id === folderId);
  if (!folder) {
    throw new Error(`Folder with id ${folderId} not found`);
  }

  prevFolder.photos = prevFolder.photos.filter((_photo) => _photo !== photo);
  photo.folder = folderId;
  folder.photos.push(photo);

  await localforage.setItem(STORAGE_KEY, { folders });
}
