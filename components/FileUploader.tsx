type FileUploaderProps = {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function FileUploader({ file, setFile }: FileUploaderProps) {
  return (
    <div>
      <label>Upload File:</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 w-full rounded-md"
      />
      {file && <p>Selected File: {file.name}</p>}
    </div>
  );
}
