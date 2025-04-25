import adjustBoxPosition from "./adjustBoxPosition";

const grabAndMove = (grabEvent) => {
  grabEvent.preventDefault();

  const cursorPosition = { x: grabEvent.clientX, y: grabEvent.clientY };

  const floater = grabEvent.currentTarget.closest('[data-role="floating"]');
  const floaterRect = floater.getBoundingClientRect();

  const floaterPosition = { x: floaterRect.x, y: floaterRect.y };

  const move = (moveEvent) => {
    const newX = floaterPosition.x + (moveEvent.clientX - cursorPosition.x);
    const newY = floaterPosition.y + (moveEvent.clientY - cursorPosition.y);

    const { adjustedX, adjustedY } = adjustBoxPosition(newX, newY, floaterRect);
    floater.style.transform = `translate(${adjustedX}px, ${adjustedY}px)`;

    floaterPosition.x = adjustedX;
    floaterPosition.y = adjustedY;

    cursorPosition.x = moveEvent.clientX;
    cursorPosition.y = moveEvent.clientY;
  };

  const drop = (e) => {
    controller.abort();
    document.body.style.userSelect = "";
  };

  const controller = new AbortController();
  const { signal } = controller;

  // Attach event listeners for dragging and dropping
  window.addEventListener("pointermove", move, { signal });
  window.addEventListener("pointerup", drop, { signal });
  window.addEventListener("pointerleave", drop, { signal });
};

export default grabAndMove;
