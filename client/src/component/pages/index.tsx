import { onMount } from "solid-js";
import { ToggleCompenent } from "../ui/Toggle";
import { ButtonCompenent } from "../ui/Button";
import { InputFile } from "../ui/InputFile";
import { spread } from "solid-js/web";

import WallpaperIcon from "../../assets/imgs/wallpaper.svg";
import ScreenRotationIcon from "../../assets/imgs/screenrotation.svg";
import VolumeUpIcon from "../../assets/imgs/volumeup.svg";
import ToggleIcon from "../../assets/imgs/toggle.svg";

type SendCommand = (type: string, data: Record<string, any>) => void;

interface MouseComponentProps {
  sendCommand: SendCommand;
}

interface AnnoyancesProps {
  sendCommand: SendCommand;
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
  let hasMoved = false;
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
    hasMoved = true;
    sendMoveCommand(event.pageX, event.pageY);
  };

  const handleMouseDown = (event: MouseEvent) => {
    hasMoved = false;
    isTrackingMouse = true;
    lastPosition = null;
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    if (!hasMoved) {
      props.sendCommand("mouseclick", { button: "left" });
    }

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
      <div class="h-32 p-3 flex justify-between gap-4 *:bg-neutral-800 *:rounded-full *:hover:bg-neutral-800/50 *:transition-colors *:duration-200 *:active:bg-neutral-700">
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
      class="relative h-full w-full overflow-y-scroll p-4 space-y-4"
      style="scrollbar-width: none;"
    >
      <div class="flex flex-row gap-4">
        <img src={ToggleIcon} alt="" />
        <p class="text-2xl text-neutral-300">Toggles</p>
      </div>

      <ToggleCompenent
        name="Mouse jitter"
        onClick={(toggle) => {
          props.sendCommand("toggle", {
            name: "seizure",
            toggle: toggle,
          });
        }}
      />

      <div class="flex flex-row gap-4">
        <img src={VolumeUpIcon} alt="" />
        <p class="text-2xl text-neutral-300">Soundboard</p>
      </div>

      <div class=" grid grid-cols-3 gap-4">
        <ButtonCompenent
          name="Kippen rijder"
          onClick={(e) => {
            props.sendCommand("playsound", {
              file: "sounds/kippenrijder.mp3",
            });
          }}
        />

        <ButtonCompenent
          name="Vine boom"
          onClick={(e) => {
            props.sendCommand("playsound", {
              file: "sounds/vine-boom.mp3",
            });
          }}
        />
      </div>

      <div class="flex flex-row gap-4">
        <img src={ScreenRotationIcon} alt="" />
        <p class="text-2xl text-neutral-300">Display orientation</p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <ButtonCompenent
          name="Landscape"
          onClick={(e) => {
            props.sendCommand("rotate", {
              orientation: 0,
            });
          }}
        />

        <ButtonCompenent
          name="Landscape (flipped)"
          onClick={(e) => {
            props.sendCommand("rotate", {
              orientation: 2,
            });
          }}
        />
      </div>

      <div class="flex flex-row gap-4">
        <img src={WallpaperIcon} alt="" />
        <p class="text-2xl text-neutral-300">Change background</p>
      </div>
      <InputFile
        onUpload={(base64String: string) => {
          props.sendCommand("background", {
            base64: base64String,
          });
        }}
        accept={null}
        name={<span class="flex flex-row gap-4">Upload background</span>}
      />
    </div>
  );
};
