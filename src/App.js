import React, { useState } from "react";

//React Dropzone
import { useDropzone } from "react-dropzone";

//Pintura Image Editor
import "@pqina/pintura/pintura.css";
import { openDefaultEditor } from "@pqina/pintura";

function App() {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const editImage = (image, index) => {
    //Imagem original
    const imageFile = image.pintura ? image.pintura.file : image;
    //Modificações da imagem, feitas pela
    const imageState = image.pintura ? image.pintura.data : {};

    const editor = openDefaultEditor({
      src: imageFile,
      imageState,
    });

    //Eventos da biblioteca.
    editor.on("close", () => {});

    editor.on("process", ({ dest: fileModified, imageState }) => {
      //Feito para manter o estado inicial da imagem, caso
      //a pessoa queira modifica-la novamente do inicio.
      Object.assign(fileModified, {
        pintura: { file: imageFile, data: imageState },
      });
      //Para criar um preview da imagem no front.
      Object.assign(fileModified, {
        preview: URL.createObjectURL(fileModified),
      });

      //para mudar o estado da aplicação em relação a file.
      const updatedFiles = [...files];
      updatedFiles[index] = fileModified;
      setFiles(updatedFiles);
    });
  };

  return (
    <section className="container">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        {files.map((file, index) => (
          <div key={file.name}>
            <div>
              <img src={file.preview} alt={file.name} />
            </div>
            <button onClick={() => editImage(file, index)}>Edit</button>
          </div>
        ))}
      </aside>
    </section>
  );
}

export default App;
