import type { Photo } from "@capacitor/camera";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { isPlatform } from "@ionic/react";
import { useEffect, useState } from "react";

export function usePhotoGallery(): {
  addNewToGallery: () => Promise<void>;
  deletePhoto: (photo: UserPhoto) => Promise<void>;
  photos: UserPhoto[];
} {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const PHOTO_STORAGE = "photos";

  useEffect(() => {
    const loadSavedPhotos = async () => {
      const { value: photoList } = await Preferences.get({
        key: PHOTO_STORAGE,
      });
      const photosInPreferences = (
        photoList ? JSON.parse(photoList) : []
      ) as UserPhoto[];

      if (!isPlatform("hybrid")) {
        for (const photo of photosInPreferences) {
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data,
          });

          photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
        }
      }

      setPhotos(photosInPreferences);
    };

    loadSavedPhotos();
  }, []);

  const addNewToGallery = async () => {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = new Date().getTime() + ".jpeg";
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    const newPhotos = [savedImageFile, ...photos];

    setPhotos(newPhotos);

    Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });
  };

  const savePicture = async (
    photo: Photo,
    fileName: string,
  ): Promise<UserPhoto> => {
    let base64Data: string | Blob;

    if (isPlatform("hybrid")) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (isPlatform("hybrid")) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  const base64FromPath = async (path: string): Promise<string> => {
    const response = await fetch(path);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject("method did not return a string");
        }
      };
      reader.readAsDataURL(blob);
    });
  };

  const deletePhoto = async (photo: UserPhoto) => {
    // Remove this photo from the Photos reference data array
    const newPhotos = photos.filter((p) => p.filepath !== photo.filepath);

    // Update photos array cache by overwriting the existing photo array
    Preferences.set({ key: PHOTO_STORAGE, value: JSON.stringify(newPhotos) });

    // Delete photo file from filesystem
    const filename = photo.filepath.slice(photo.filepath.lastIndexOf("/") + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });

    setPhotos(newPhotos);
  };

  return {
    addNewToGallery,
    deletePhoto,
    photos,
  };
}

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}
