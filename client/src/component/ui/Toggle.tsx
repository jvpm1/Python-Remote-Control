import { createSignal } from "solid-js";

interface ToggleProps {
  onClick: (toggle: boolean) => void;
  name: string;
}

export const ToggleCompenent = (props: ToggleProps) => {
  const [isToggled, setToggled] = createSignal(false);
  return (
    <button
      onclick={() => {
        setToggled(!isToggled());
        props.onClick(isToggled());
      }}
      class="flex flex-row gap-4 items-center p-4 text-lg w-full text-start bg-neutral-700/50 text-neutral-300 rounded-3xl"
    >
      <div class="flex flex-col justify-center w-12 h-5 bg-neutral-700 rounded-full overflow-clip">
        <div
          class={`transition-all h-full aspect-auto bg-neutral-300 rounded-full ${
            isToggled() ? "w-full" : "w-0"
          }`}
        ></div>
      </div>
      {props.name}
    </button>
  );
};
