export type Photo = {
  id: string;
  base64: string;
  folder: string;
};

export type Folder = {
  id: string;
  name: string;
  photos: Photo[];
};

export type Storage = {
  folders: Folder[];
};
