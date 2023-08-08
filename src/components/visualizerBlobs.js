import React, { useState, useEffect, useMemo, useRef } from "react";

import { mapN, randRange } from "../utils";

import { toMidi } from "sfumato";

import { aminoAcidhsls, noteMappings } from "../mappings";

import { useAnimationFrame } from "../graphics";

export const VisualizerBlobs = ({
  playing,
  counter, // renderframes
  playheads, // main playheads
  activeNotes, // active note refs, for actual gate
  counters, // separate counts from each playhead
  countRefs, // count references
  sequence,
  nodes,
  zoom,
  width,
  height,
  param1,
  param2,
  cps,
}) => {
  // boxSide x amount =
  const fixedLength = false;
  const ANIMATION_TIME = 3.0;

  const lastCounter = useRef(counter);
  const spacingX = 16;
  const boxSide = 30 * zoom;
  const colSpace = boxSide / 5;
  const rowSpace = boxSide / 3;
  const boxAspect = 1.2; // w x h 1 : 1.4
  const perRow =
    Math.floor(
      Math.floor((width - spacingX * 2) / (boxSide + colSpace / 3)) / 3
    ) * 3;
  const rows = Math.ceil(sequence.length / perRow);
  const spacingY = height - rows * (boxSide * boxAspect + rowSpace * 1.5);

  useEffect(() => {
    lastCounter.current = playing ? counter : lastCounter.current;
  }, [counter]);

  const getCoord = (i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const offsetX = Math.floor(col / 3);
    const x = col * boxSide + offsetX * colSpace;
    const y = row * (boxSide + rowSpace);
    return {
      //   y: x%2 === 1 ? y : ((perRow - 1) * boxSide) - y ,
      y: spacingY + y * boxAspect,
      x: spacingX + x,
    };
  };
  const getAcidSprite = (letter) => {
    const spritePath = `/assets/acids/amino_${letter.toLowerCase()}.png`;
    return spritePath;
  };

  const [count, setCount] = React.useState(0);

  let lastTick = [-1, -1, -1, -1, -1];
  let lastSpawned = [false, false, false, false, false];
  let lastIndex = [-1, -1, -1, -1, -1];
  let activeBlobs = [];
  //

  let tick = 0;

  let blobCount = 0;

  let blobs = [{}, {}, {}, {}, {}];

  const animationCallback = () => {
    const svg = document.querySelector(".svg");
    tick = tick + 1;

    const timeWindow = cps * 1000;

    // check to add new blobs
    for (let i = 0; i < playheads.length; i++) {
      if (activeNotes[i].current) {
        // note is currently active
        const index = countRefs[i].current;
        const currentNode = nodes[Math.floor(index / 3)];
        const note = noteMappings[currentNode.aminoacid];
        const { x, y } = getCoord(countRefs[i].current * 3);
        // check if just switched from note active to active
        if (!lastSpawned[i]) {
          blobCount += 1;
          startNoteAnimation(
            x + boxSide * 1.5,
            y,
            `${i}-${tick}`,
            playheads[i].hsl,
            svg
          );
          lastTick[i] = tick;
        } else {
          if (lastIndex[i] !== index) {
            console.log("||-", blobCount, "despawn", `${i}-${lastTick[i]}`);
            endNoteAnimation(`${i}-${lastTick[i]}`, playheads[i].hsl, svg);
            
            console.log("||+", blobCount, "spawn", `${i}-${tick}`);
            startNoteAnimation(
              x + boxSide * 1.5,
              y,
              `${i}-${tick}`,
              playheads[i].hsl,
              svg
            );
            lastTick[i] = tick;
          }
        }
        lastSpawned[i] = true;
        lastIndex[i] = index;
      } else {
        // check if note has become not active
        if (lastSpawned[i]) {
          //   // check if note has just become not active
          // //   if (lastTick[i] !== tick - 1) {
          blobCount -= 1;
          console.log("---", blobCount, "despawn", `${i}-${lastTick[i]}`);
          endNoteAnimation(`${i}-${lastTick[i]}`, playheads[i].hsl, svg);
          // //   }
        }
        lastSpawned[i] = false;
      }
      //   lastNotes[i] = note
    }
    /* 
        we want to remove the notes when
        1. the note is not the same as the one before
        2. or when lastSpawned is false 

    */
  };

  const animationCallbackRef = useRef(animationCallback);

  useEffect(() => {
    endAllAnimations();
    animationCallbackRef.current = animationCallback;
  }, [zoom, sequence]);

  // main animation loop
  useAnimationFrame(animationCallbackRef);

  var paramSet = 1;
  var params = [
    {
      x: 0.05227467811158796,
      y: 0.05744431418522861,
    },
    {
      x: 0.2618025751072961,
      y: 0.08366013071895424,
    },
    {
      x: 0.5507868383404864,
      y: 0.4856711915535445,
    },
    {
      x: 0.621173104434907,
      y: 0.53215686274509803,
    },
  ];

  var px = params[paramSet].x;
  var py = params[paramSet].y;

  var setBezierParams = () => {
    px = params[paramSet].x;
    py = params[paramSet].y;
  };

  var svg = document.querySelector(".svg");

  var generatePoints = (initialX, initialY) => {
    const num = 7;
    var scaleX = height / 88;
    var scaleY = height / num;
    var points = [];
    for (var i = 0; i < num; i++) {
      var dir = Math.random() < 0.5 ? -1 : 1;
      var offsetFactorX = randRange(0, 300) * px;
      var x = initialX + dir * 0.2 * i * offsetFactorX;
      var offsetY = scaleY * 0.6;
      //   var y = initialY - (i * scaleY + Math.random() * offsetY);
      var y = initialY - i * scaleY;
      points.push([x, y]);
    }
    points.push([initialX, -10]); // final point
    return points;
  };

  var getAnimationTimeForParam = (param) => {
    if (param === 0) {
      return "6s";
    } else if (param === 1) {
      return "7s";
    } else if (param === 2) {
      return "10s";
    } else if (param === 3) {
      return "11s";
    }
  };

  var createSVGPath = (path, animation, id, hsl) => {
    var newPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    newPath.setAttributeNS(null, "class", animation);
    newPath.setAttributeNS(null, "id", id);
    newPath.setAttributeNS(null, "d", path);
    // newPath.setAttributeNS(null, "data-velocity", velocity);

    var len = newPath.getTotalLength();
    var path_offset = len;
    var start = len;
    var initial = len;
    var segment_length = len;
    var end = len * 2;

    newPath.setAttributeNS(
      null,
      "style",
      `--h: ${hsl.h * 360};
      --s: ${hsl.s * 100}%;
      --l: ${hsl.l * 100}%;
      --stroke-width: ${50 * zoom};
        --offset: ${path_offset};
        --start: ${start};
        --end: ${end};
        --initial: ${initial};
        --timeout: ${getAnimationTimeForParam(paramSet)};
        --segment_length: ${segment_length}`
    );

    return newPath;
  };

  var keyCounters = {};

  var addKeyCount = (key) => {
    if (keyCounters.hasOwnProperty(key)) {
      keyCounters[key] += 1;
    } else {
      keyCounters[key] = 1;
    }
    return keyCounters[key];
  };

  var startNoteAnimation = (x, y, id, hsl, svg) => {
    var steps = width / 65;
    // where do the notes appear?
    var points = generatePoints(x, y);
    var d = svgPath(points, bezierCommand);
    var path = createSVGPath(d, "animating", id, hsl);
    svg.appendChild(path);
  };

  var endAllAnimations = () => {
    const animating = [...document.querySelectorAll(".animating")];
    if (animating.length) {
      svg = document.querySelector(".svg");
      animating.forEach((path) => {
        svg.removeChild(path);
      });
    }
  };

  var endNoteAnimation = (id, hsl, svg) => {
    var path = document.getElementById(id);
    if (!path) {
      // TODO: do this in a cleaner way
      return;
    }
    if (path.classList.contains("animatingEnd")) {
      return;
    }
    var matrix = getComputedStyle(path).getPropertyValue("stroke-dasharray");
    var velocity = getComputedStyle(path).getPropertyValue("stroke-width");
    var dashArrayStart = parseFloat(matrix.split("px")[0], 10);

    var len = path.getTotalLength();
    var path_offset = len * 2;
    var start = len;
    var initial = len;
    var segment_length = dashArrayStart - len;
    var end = len + len + segment_length;

    path.setAttributeNS(
      null,
      "style",
      `--h: ${hsl.h * 360};
      --s: ${hsl.s * 100}%;
      --l: ${hsl.l * 100}%;
      --stroke-width: ${50 * zoom};
      --offset: ${path_offset};
      --start: ${start};
      --end: ${end};
      --initial: ${initial};
      --start_midway: ${(start + end) / 2};
      --timeout2: ${fixedLength ? "1.5s" : "2s"};
      --segment_length: ${segment_length}`
    );
    path.setAttributeNS(null, "class", "animatingEnd");

    setTimeout(() => {
      svg.removeChild(path);
    }, 1000 * ANIMATION_TIME);
  };

  var svgPath = (points, command) => {
    var d = points.reduce(
      (acc, point, i, a) =>
        i === 0
          ? `M ${point[0]},${point[1]}`
          : `${acc} ${command(point, i, a)}`,
      ""
    );
    return d;
  };

  var line = (pointA, pointB) => {
    var lengthX = pointB[0] - pointA[0];
    var lengthY = pointB[1] - pointA[1];
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX),
    };
  };

  var lineCommand = (point) => `L ${point[0]} ${point[1]}`;

  var controlPoint = (current, previous, next, reverse) => {
    var p = previous || current;
    var n = next || current;
    // The smoothing ratio
    var smoothing = 2 * py;
    // Properties of the opposed-line
    var o = line(p, n);
    // If is end-control-point, add PI to the angle to go backward
    var angle = o.angle + (reverse ? Math.PI : 0);
    var length = o.length * smoothing;
    // The control point position is relative to the current point
    var x = current[0] + Math.cos(angle) * length;
    var y = current[1] + Math.sin(angle) * length;
    return [x, y];
  };

  var bezierCommand = (point, i, a) => {
    var [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
    var [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
    return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
  };

  return <div></div>;
};