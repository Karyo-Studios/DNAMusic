import React, { useCallback } from "react";

import { Graphics } from "@pixi/react";

export const Blob = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(props.color);
      g.drawCircle(props.x, props.y, props.radius);
      g.endFill();
    },
    [props]
  );
  return <Graphics draw={draw} />;
};

export const Tile = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      //  g.beginFill(`hsl(192,0%,${props.noteColor}%)`);
      g.lineStyle(props.height / 15, props.color, 1);
      g.drawRoundedRect(2, 0, props.width, props.height, 3);
      g.endFill();
    },
    [props]
  );
  return <Graphics draw={draw} />;
};

export const PlayheadTile = (props) => {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(props.color);
      g.lineStyle(props.height / 15, 0xffffff, 1);
      g.drawRoundedRect(2, 0, props.width, props.height, 3);
      g.endFill();
    },
    [props]
  );
  return <Graphics draw={draw} />;
};

export const useAnimationFrame = (callback) => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();

  const animate = (time) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback.current(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
};