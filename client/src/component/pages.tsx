import { onMount } from "solid-js";

export const FooterButton = (props: any) => {
  return (
    <button
      class="flex flex-col justify-center group p-4"
      onClick={() => {
        props.onPageButtonPress(props.pageNumber);
      }}
    >
      <img
        src={props.icon}
        alt=""
        class={`h-9 py-1 rounded-full transition-colors duration-200 ${
          props.selectedPage() == props.pageNumber
            ? "bg-indigo-400/50"
            : "group-hover:bg-neutral-700"
        }`}
      />
      <p>{props.name}</p>
    </button>
  );
};

export const PageCompenent = (props: any) => {
  return (
    <section
      class={`transition-opacity duration-300 ease-in-out ${
        props.selectedPage() == props.pageNumber
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {props.component}
    </section>
  );
};

export const MouseCompenent = (props: any) => {
  let stickContainer;
  let stick;

  onMount(() => {
    console.log(stick, stickContainer);
  });

  return (
    <div class="flex justify-center items-center">
      <div
        ref={stickContainer}
        id="stick-container"
        class="bg-neutral-800 w-[90vw] max-w-[70vh] aspect-square rounded-full relative"
      >
        <div
          ref={stick}
          class="bg-neutral-700 w-32 aspect-square rounded-full absolute"
        ></div>
      </div>
    </div>
  );
};
