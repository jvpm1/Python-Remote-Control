interface ButtonProps {
  onClick: (event: MouseEvent) => void;
  name: string;
}

export const ButtonCompenent = (props: ButtonProps) => {
  return (
    <button
      onclick={(e) => {
        props.onClick(e);
      }}
      class="flex flex-row gap-4 items-center p-4 text-lg w-full text-start bg-neutral-800/50 text-neutral-300 rounded-3xl active:bg-neutral-700 transition-colors"
    >
      {props.name}
    </button>
  );
};
