'use client';

import React, { useState } from 'react';
import type { FilePondInitialFile } from 'filepond';
import { FilePond, registerPlugin, type FilePondProps } from 'react-filepond';
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

export type UploadFolder = 'books' | 'authors';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  defaultValue?: string;
  /** Azure blob prefix / API form field */
  uploadFolder?: UploadFolder;
  labelIdle?: string;
  /** Book cover uses 3:4; author portrait can stay square-ish */
  imageCropAspectRatio?: string | number;
  imageResizeTargetWidth?: number;
  imageResizeTargetHeight?: number;
}

export function FileUpload({
  onUploadComplete,
  defaultValue,
  uploadFolder = 'books',
  labelIdle,
  imageCropAspectRatio = '3:4',
  imageResizeTargetWidth = 300,
  imageResizeTargetHeight = 400,
}: FileUploadProps) {
  const [files, setFiles] = useState<FilePondProps["files"]>(
    defaultValue ? [{ source: defaultValue, options: { type: 'local' } }] : []
  );

  const idle =
    labelIdle ??
    (uploadFolder === 'authors'
      ? 'Presuňte fotku autora alebo <span class="filepond--label-action">Prehliadať</span>'
      : 'Presuňte obrázok obálky alebo <span class="filepond--label-action">Prehliadať</span>');

  return (
    <div className="file-upload-wrapper">
      <FilePond
        files={files}
        onupdatefiles={(items) => setFiles(items as unknown as FilePondProps["files"])}
        allowMultiple={false}
        maxFiles={1}
        acceptedFileTypes={['image/*']}
        server={{
          process: {
            url: '/api/upload',
            ondata: (formData) => {
              formData.append('folder', uploadFolder);
              return formData;
            },
            onload: (response: string) => {
              const { url } = JSON.parse(response);
              onUploadComplete(url);
              return url;
            },
          },
        }}
        name="filepond"
        labelIdle={idle}
        imagePreviewHeight={170}
        imageCropAspectRatio={
          imageCropAspectRatio === undefined
            ? undefined
            : typeof imageCropAspectRatio === "number"
              ? String(imageCropAspectRatio)
              : imageCropAspectRatio
        }
        imageResizeTargetWidth={imageResizeTargetWidth}
        imageResizeTargetHeight={imageResizeTargetHeight}
      />
    </div>
  );
}
