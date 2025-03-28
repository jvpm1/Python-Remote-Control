import { LoadingDots } from "./loading-dots";

interface ConnectionProps {
  connectionError: any;
  connectFunction: any;
  abort: any;

  isConnected: any;
  isConnecting: any;

  setConnected: any;
  setConnecting: any;
}

export const ConnectionComponent = (props: ConnectionProps) => {
  let codeTextBox;
  return (
    <div
      class={`absolute inset-0 w-screen h-screen text-gray-300 flex justify-center items-center bg-neutral-900 p-4 transition-opacity duration-300 ${
        props.isConnected() ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div class="bg-neutral-800/65 rounded-3xl p-6 w-full lg:w-3xl space-y-4">
        <div class="flex flex-row gap-4">
          <h2 class="text-3xl">Remote controller</h2>
        </div>

        <section class="px-1 space-y-4">
          {/* Code textbox */}
          <p>Connection code</p>
          <input
            type="textbox"
            ref={codeTextBox}
            class="bg-neutral-800 rounded-3xl px-4 p-3 text-md w-full outline-none text-gray-300 transition-all duration-300 focus:bg-neutral-600 disabled:opacity-50 disabled:bg-neutral-600"
            placeholder="Enter here"
            disabled={props.isConnecting()}
          ></input>
          {props.connectionError() != "" && (
            <p class="mx-5 text-red-500">{props.connectionError()}</p>
          )}

          {/* Bottom buttons */}
          <div class="flex flex-row gap-4">
            {/* Connect button */}
            <button
              onClick={async (button) => {
                props.connectFunction(button, codeTextBox);
              }}
              class="bg-indigo-400 text-indigo-950 rounded-full text-xl px-11 h-13 transition-all active:bg-neutral-600 disabled:opacity-50 disabled:bg-neutral-600 items-center flex justify-center"
              disabled={props.isConnecting()}
            >
              {props.isConnecting() ? <LoadingDots /> : "Connect"}
            </button>

            {/* Abort button */}
            <button
              onClick={props.abort}
              class={`p-2 px-4 bg-neutral-700 w-auto text-gray-300 rounded-3xl transition-opacity duration-1000 ${
                props.isConnecting()
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              Abort
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
