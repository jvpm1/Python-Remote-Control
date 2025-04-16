interface InputFileProps {
  onUpload: (base64: string) => void;
  accept: string | null;
  name: any;
}

export const InputFile = (props: InputFileProps) => {
  const onFileChange = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event: any) => {
      const data = event.target.result as string;
      const base64 = data.split(",")[1];

      props.onUpload(base64);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div class="relative flex flex-row gap-4 items-center p-4 text-lg w-full text-start border-4 border-neutral-700/50 text-neutral-300 rounded-3xl active:bg-neutral-700 transition-colors">
      <input
        type="file"
        accept={props.accept || "image/png*"}
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={onFileChange}
      />
      <p>{props.name}</p>
    </div>
  );
};
