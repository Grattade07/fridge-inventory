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
} from "@ionic/react";
import "./Import_Receipt.css";

import { camera } from "ionicons/icons";
import { usePhotoGallery } from "../../hooks/usePhotoGallery";

const ImportRecipt: React.FC = () => {
  const { addNewToGallery, photos } = usePhotoGallery();

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
                <img
                  src={photo.webviewPath}
                  alt={`Photo ${index + 1}`}
                  loading="lazy"
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={() => addNewToGallery()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ImportRecipt;
