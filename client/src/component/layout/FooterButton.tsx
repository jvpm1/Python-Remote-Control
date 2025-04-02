export const FooterButton = (props: any) => {
  return (
    <button
      class="flex flex-col justify-center items-center group p-4"
      onClick={() => {
        props.onPageButtonPress(props.pageNumber);
      }}
    >
      <img
        src={props.icon}
        alt=""
        class={`h-7 px-3 rounded-full transition-colors duration-200 ${
          props.selectedPage() == props.pageNumber
            ? "bg-blue-300/30"
            : "group-hover:bg-neutral-700"
        }`}
      />
      <span>{props.name}</span>
    </button>
  );
};
