export const LoadingDots = () => {
  return (
    <div class="flex space-x-1 h-6 items-center">
      <div
        class="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
        style="animation-delay: 0ms"
      ></div>
      <div
        class="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
        style="animation-delay: 200ms"
      ></div>
      <div
        class="w-2 h-2 bg-gray-300 rounded-full animate-pulse"
        style="animation-delay: 400ms"
      ></div>
    </div>
  );
};
