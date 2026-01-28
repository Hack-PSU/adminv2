"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Trash2 } from "lucide-react";
import { Path, UseControllerProps, FieldValues, useController } from "react-hook-form";

interface DropzoneProps<TFieldValues extends FieldValues> {
    name: Path<TFieldValues>;
    control: UseControllerProps<TFieldValues>['control'];
    rules?: UseControllerProps<TFieldValues>['rules'];
    defaultValue?: UseControllerProps<TFieldValues>['defaultValue'];
}

export default function Dropzone<TFieldValues extends FieldValues>({
    name, control, rules, defaultValue
}: DropzoneProps<TFieldValues>) {
    const [preview, setPreview] = useState<string | null>(null);
    const { field, fieldState: { error }} = useController({ name, control, rules, defaultValue });

    useEffect(() => {
        // This runs every time the preview changes
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            field.onChange(acceptedFiles[0]);

            // Convert to URL to get preview
            const objectUrl = URL.createObjectURL(acceptedFiles[0]);
            setPreview(objectUrl);

            // Clean memory when component unmounts
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        multiple: false,
        accept: { 'image/*': [] }
    });

    const onDelete = () => {
        field.onChange(null);
        setPreview(null);
    }

    return (
        <div {...getRootProps()} className="flex items-center justify-center w-full h-48 border border-dashed rounded overflow-hidden  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            
            {!field.value ? (
                <div>
                    <input {...getInputProps()}/>
                    <DropzonePlaceholder />
                </div>
             ) : <DropzoneItem file={field.value} preview={preview} onDelete={onDelete}  /> }
        </div>
    );
}

interface DropzoneItemProps {
    file: File,
    preview: string | null,
    onDelete: () => void
}

const DropzoneItem = ({ file, preview, onDelete }: DropzoneItemProps) => {
    return (
      <div className="flex flex-col items-center justify-between w-full h-full">
        <img
          src={preview || undefined}
          alt={file.name}
          className="w-full h-full object-cover"
        />

        <div className="flex flex-row gap-2 items-center justify-between w-full bg-white p-2 rounded">
          <div className="text-sm text-centerfont-medium text-zinc-800 truncate">{file.name}</div>
          <Trash2 onClick={onDelete} className="cursor-pointer hover:text-red-500" />
        </div>
      </div>  
    );
};

const DropzonePlaceholder = () => {
    return (
       <div className="flex flex-col gap-2 items-center justify-center">
            <Upload />
            <div className="text-center text-md font-medium text-zinc-800">Drag image here or click to upload.</div>
        </div> 
    )
}