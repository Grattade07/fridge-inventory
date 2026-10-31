import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonActionSheet,
} from "@ionic/react";
import "./Import_Receipt.css";

import { camera, trash, close } from "ionicons/icons";
import { useState } from "react";
import type { UserPhoto } from "../../hooks/usePhotoGallery";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";

const ImportRecipt: React.FC = () => {
  const { addNewToGallery, photos, deletePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Import Receipt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Import Receipt</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <button onClick={() => setPhotoToDelete(photo)}>
                  <img
                    src={photo.webviewPath}
                    alt={`Photo ${index + 1}`}
                    loading="lazy"
                  />
                </button>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => addNewToGallery()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[
            {
              text: "Delete",
              role: "destructive",
              icon: trash,
              handler: () => {
                if (photoToDelete) {
                  deletePhoto(photoToDelete);
                  setPhotoToDelete(undefined);
                }
              },
            },
            {
              text: "Cancel",
              icon: close,
              role: "cancel",
              handler: () => {
                // Nothing to do, action sheet is automatically closed
              },
            },
          ]}
          onDidDismiss={() => setPhotoToDelete(undefined)}></IonActionSheet>
      </IonContent>
    </IonPage>
  );
};

export default ImportRecipt;
