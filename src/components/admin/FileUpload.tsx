'use client';

import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginFileValidateType
);

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  defaultValue?: string;
}

export function FileUpload({ onUploadComplete, defaultValue }: FileUploadProps) {
  const [files, setFiles] = useState<any[]>(
    defaultValue ? [{ source: defaultValue, options: { type: 'local' } }] : []
  );

  return (
    <div className="file-upload-wrapper">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        maxFiles={1}
        acceptedFileTypes={['image/*']}
        server={{
          process: {
            url: '/api/upload',
            onload: (response: string) => {
              const { url } = JSON.parse(response);
              onUploadComplete(url);
              return url;
            },
          },
        }}
        name="filepond"
        labelIdle='Presuňte obrázok obálky alebo <span class="filepond--label-action">Prehliadať</span>'
        imagePreviewHeight={170}
        imageCropAspectRatio="3:4"
        imageResizeTargetWidth={300}
        imageResizeTargetHeight={400}
      />
    </div>
  );
}
