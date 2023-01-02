// Dropzone widget from react-dtopzone. Super helpful and a nice UI feature for dragging and dropping a photo into the browser when uploading

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Header, Icon } from "semantic-ui-react";

interface Props {
      // We are using any here so we can see it as a preview later on and not just a file:
  setFiles: (files: any) => void;
}

export default function PhotoUploadWidgetDropzone({ setFiles }: Props) {
  // Styling here:
  const dzStyles = {
    border: "dashed 3px #eee",
    borderColor: "#eee",
    borderRadius: "5px",
    paddingTop: "30px",
    textAlign: "center" as "center",
    height: "200px",
  };

  // Styling for active
  const dzActive = {
    borderColor: "green",
  };

  // Callback function for dropping the file in
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );

  // Destructuring:
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}
    >
      <input {...getInputProps()} />
      <Icon name="upload" size="huge" />
      <Header content="Drop image here" />
    </div>
  );
}
