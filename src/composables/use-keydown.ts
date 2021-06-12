import { onBeforeUnmount } from "@vue/composition-api";

export const useKeydown = function (keyCombos: { key: string; fn: () => void }[]): void {
  const onkey = function (event: { key: string }) {
    const kc = keyCombos.find(({ key }) => key === event.key);
    if (kc) {
      kc.fn();
    }
  };

  window.addEventListener("keydown", onkey);

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onkey);
  });
};
