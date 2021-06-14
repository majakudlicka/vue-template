import { onBeforeUnmount } from "@vue/composition-api";

// Utility to bind events to a given keyboard key. Note the use of onBeforeUnmount
export const useKeydown = function (
  keyCombos: { key: string; fn: () => void }[]
): void {
  const onKey = function (event: { key: string }) {
    const kc = keyCombos.find(({ key }) => key === event.key);
    if (kc) {
      kc.fn();
    }
  };

  window.addEventListener("keydown", onKey);

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKey);
  });
};
