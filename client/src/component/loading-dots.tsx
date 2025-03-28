export const LoadingDots = () => {
  return (
    <div class="flex space-x-1 h-6 items-center">
      <div
        class="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
        style="animation-delay: 0ms"
      ></div>
      <div
        class="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
        style="animation-delay: 300ms"
      ></div>
      <div
        class="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
        style="animation-delay: 600ms"
      ></div>
    </div>
  );
};
