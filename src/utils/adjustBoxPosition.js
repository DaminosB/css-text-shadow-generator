const adjustBoxPosition = (x, y, boxSize, avoidRect) => {
  let adjustedX = Math.max(0, Math.min(x, window.innerWidth - boxSize.width));
  let adjustedY = Math.max(0, Math.min(y, window.innerHeight - boxSize.height));

  // console.log(x, boxSize.width);

  if (avoidRect) {
    const isOverlappingX =
      (adjustedX >= avoidRect.left && adjustedX < avoidRect.right) ||
      (avoidRect.left >= adjustedX &&
        avoidRect.left < adjustedX + boxSize.width);

    if (isOverlappingX) {
      if (avoidRect.top - boxSize.height < 0) {
        adjustedY = Math.min(
          avoidRect.bottom,
          window.innerHeight - boxSize.height
        );
      } else {
        adjustedY = avoidRect.top - boxSize.height;
      }

      adjustedX = Math.max(
        0,
        Math.min(
          avoidRect.left + avoidRect.width / 2 - boxSize.width / 2,
          window.innerWidth - boxSize.width
        )
      );
    }
  }

  return { adjustedX, adjustedY };
};

export default adjustBoxPosition;
