import { onMount } from "solid-js";
import { ToggleCompenent } from "../ui/Toggle";
import { ButtonCompenent } from "../ui/Button";

interface MouseComponentProps {
  sendCommand: (type: string, data: Record<string, any>) => void;
}

interface AnnoyancesProps {
  sendCommand: (type: string, data: Record<string, any>) => void;
}

export const PageComponent = (props: any) => {
  return (
    <section
      class={`w-full h-full transition-opacity duration-300 ease-in-out ${
        props.selectedPage() == props.pageNumber ? "visible" : "hidden"
      }`}
    >
      {props.component}
    </section>
  );
};

export const MouseComponent = (props: MouseComponentProps) => {
  const MOVE_INTERVAL: number = 150; // ms

  let lastMove: number = 0;

  let touchpadElement!: HTMLDivElement;
  let leftMouseElement!: HTMLButtonElement;
  let middleMouseElement!: HTMLButtonElement;
  let rightMouseElement!: HTMLButtonElement;

  let lastPosition: { x: number; y: number } | null = null;
  let isTrackingMouse = false;
  let isTrackingTouch = false;

  const sendMoveCommand = (x: number, y: number) => {
    const currentPosition = { x, y };
    if (lastPosition === null) {
      lastPosition = currentPosition;
      return;
    }

    const currentTick = new Date().getTime();
    if (currentTick - lastMove < MOVE_INTERVAL) {
      return;
    }
    lastMove = currentTick;

    const moveDirection = {
      x: currentPosition.x - lastPosition.x,
      y: currentPosition.y - lastPosition.y,
    };

    lastPosition = currentPosition;

    props.sendCommand("movemouse", {
      x: moveDirection.x,
      y: moveDirection.y,
    });
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isTrackingMouse) return;
    sendMoveCommand(event.pageX, event.pageY);
  };

  const handleMouseDown = (event: MouseEvent) => {
    isTrackingMouse = true;
    lastPosition = null;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    isTrackingMouse = false;
    lastPosition = null;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const onTouchMove = (event: TouchEvent) => {
    if (!isTrackingTouch || event.touches.length === 0) return;
    const touch = event.touches[0];
    sendMoveCommand(touch.pageX, touch.pageY);
  };

  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    if (event.touches.length > 0) {
      isTrackingTouch = true;
      lastPosition = null;
      document.addEventListener("touchmove", onTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("touchcancel", handleTouchEnd);
    }
  };

  const handleTouchEnd = () => {
    isTrackingTouch = false;
    lastPosition = null;
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
    document.removeEventListener("touchcancel", handleTouchEnd);
  };

  return (
    <div class="flex flex-col justify-between w-full h-full text-gray-300/50 text-2xl">
      <div
        ref={touchpadElement}
        onmousedown={handleMouseDown}
        ontouchstart={handleTouchStart}
        class="w-full h-full flex justify-center items-center touch-none"
      >
        <p class="select-none">Hold down or touch and move</p>
      </div>
      <div class="h-28 p-3 flex justify-between gap-4 *:bg-neutral-800 *:rounded-full *:hover:bg-neutral-800/80 *:transition-colors *:duration-200 *:active:bg-neutral-700">
        <button
          ref={leftMouseElement}
          class="w-full"
          ontouchstart={(event: TouchEvent) => {
            props.sendCommand("mouseclick", { button: "left" });
          }}
        ></button>
        <button
          ref={middleMouseElement}
          class="w-46"
          ontouchstart={(event: TouchEvent) => {
            props.sendCommand("mouseclick", { button: "middle" });
          }}
        ></button>
        <button
          ref={rightMouseElement}
          class="w-full"
          ontouchstart={(event: TouchEvent) => {
            props.sendCommand("mouseclick", { button: "right" });
          }}
        ></button>
      </div>
    </div>
  );
};

export const AnnoyancesComponent = (props: AnnoyancesProps) => {
  return (
    <div
      class="h-full w-full overflow-y-scroll p-4 space-y-4"
      style="scrollbar-width: none;"
    >
      <p class="text-2xl text-neutral-300">Toggles</p>
      <ToggleCompenent
        name="Mouse jitter"
        onClick={(toggle) => {
          props.sendCommand("toggle", {
            name: "seizure",
            toggle: toggle,
          });
        }}
      />

      <p class="text-2xl text-neutral-300">Soundboard</p>

      <ButtonCompenent
        onClick={(e) => {
          props.sendCommand("playsound", {
            file: "./sounds/kippenrijder.mp3",
          });
        }}
        name="Kippen rijder"
      />
    </div>
  );
};
