import { Button, Grid, Header } from "semantic-ui-react";
import PhotoWidgetDropzone from "./PhotoWidgetDropzone";
import { useState, useEffect } from "react";
import PhotoWidgetCropper from "./PhotoWidgetCropper";

interface Props {
  loading: boolean;
  uploadPhoto: (file: Blob) => void;
}

export default function PhotoUploadWidget({loading, uploadPhoto}: Props) {
  const [files, setFiles] = useState<any>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => uploadPhoto(blob!));
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Grid>
      <Grid.Column width={4}>
        <Header color="teal" content="Step 1: Add Photo"></Header>
        <PhotoWidgetDropzone setFiles={setFiles}></PhotoWidgetDropzone>
      </Grid.Column>
      <Grid.Column width={1}></Grid.Column>
      <Grid.Column width={4}>
        <Header color="teal" content="Step 2: Resize image"></Header>
        {files && files.length > 0 && (
          <PhotoWidgetCropper
            setCropper={setCropper}
            imagePreview={files[0].preview}
          ></PhotoWidgetCropper>
        )}
      </Grid.Column>
      <Grid.Column width={1}></Grid.Column>
      <Grid.Column width={4}>
        <Header color="teal" content="Step 1: Preview & Upload"></Header>
        {files && files.length > 0 && (
          <>
            <div
              className="img-preview"
              style={{ minHeight: 200, overflow: "hidden" }}
            ></div>
            <Button.Group widths={2}>
              <Button loading={loading} onClick={onCrop} positive icon="check"></Button>
              <Button
                onClick={() => setFiles([])}
                positive
                icon="close"
                disabled={loading}
              ></Button>
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
}
