import React, { useState, useEffect, useMemo, useRef } from "react";

import { mapN, randRange, toMidi } from "../utils";

import { aminoAcidhsls, noteMappings } from "../mappings";

import { useAnimationFrame } from "../graphics";

export const VisualizerBlobs = ({
  playing,
  counter, // renderframes
  playheads, // main playheads
  activeNotes, // active note refs, for actual gate
  countRefs, // count references
  sequence,
  nodes,
  zoom,
  width,
  height,
  cps,
  bounds,
  activeSequence,
  showOnlyActive,
  clearClick,
  playheadCount,
}) => {

  const currentSequence = showOnlyActive ? activeSequence : sequence
  const fixedLength = false;
  const ANIMATION_TIME = 3.0;

  const showDetails = true;
  const lastCounter = useRef(counter);
  const spacingX = width / 8;
  const boxSide = 30 * zoom;
  // 1.2 * x + spacingX * 2 = 1200 * y .. TODO figure out this equation so the sequence takes up the whole space!
  const colSpace = 0 * boxSide / 5;
  const rowSpace = boxSide / 10;
  const boxAspect = 1.2;
  const detailSpace = showDetails ? boxSide * boxAspect * 1.1 : 0

  const cols =
    Math.floor(
      Math.floor((width - spacingX * 2) / (boxSide + colSpace / 3)) / 3
    ) * 3;
  const rows = Math.ceil(currentSequence.length / cols);
  const spacingY = height - (height / 8) - rows * (boxSide * boxAspect + rowSpace * 1.5 + detailSpace) + detailSpace;

  useEffect(() => {
    lastCounter.current = playing ? counter : lastCounter.current;
  }, [counter]);

  useEffect(() => {
    setUpdatedCount(0)
    endAllAnimations()
  }, [clearClick])

  const getCoord = (i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const offsetX = Math.floor(col / 3);
    const x = col * boxSide + offsetX * colSpace;
    const y = row * (boxSide + rowSpace + detailSpace);
    const unit = boxSide + colSpace / 3
    const xRemainder = rows === 1 ? (width - unit * currentSequence.length) / 2 : (width - unit * cols) / 2
    return {
      //   y: x%2 === 1 ? y : ((cols - 1) * boxSide) - y ,
      y: spacingY + y * boxAspect,
      x: spacingX + x + xRemainder - spacingX,
    };
  };

  let lastTick = [-1, -1, -1, -1, -1];
  let lastSpawned = [false, false, false, false, false];
  let lastIndex = [-1, -1, -1, -1, -1];
  let ticks = 0;

  let blobCount = 0;

  const [updatedCount, setUpdatedCount] = useState(0);

  const updatedRef = useRef(0);

  useEffect(() => {
    updatedRef.current = updatedCount;
  }, [updatedCount]);

  const renderDebounce = 600

  const animationCallback = (delta) => {
    const svg = document.querySelector(".svg");
    ticks = ticks + 1;

    const timeWindow = cps * 1000;

    // check to add new blobs
    for (let i = 0; i < playheadCount; i++) {
      if (activeNotes[i].current && updatedRef.current > renderDebounce) {
        // note is currently active
        const index = countRefs[i].current;
        const currentNode = nodes[Math.floor(index)];
        if (currentNode === undefined) return;
        const count = showOnlyActive ? countRefs[i].current * 3 : Math.ceil((bounds[0] + countRefs[i].current * 3) / 3) * 3
        // const noteX = mapN(midi, 45, 90, 0, width)
        // const x = noteX;
        // const y = 400;
        if (parseInt(currentNode.aminoacid) === -1) continue;
        const { x, y } = getCoord(count);
        // check if just switched from note active to active
        if (lastIndex[i] !== index) {
          if (!lastSpawned[i]) {
            blobCount += 1;
            startNoteAnimation(
              x + boxSide * 1.5,
              // x,
              y,
              `${i}-${ticks}`,
              playheads[i].hsl,
              svg
            );
            lastTick[i] = ticks;
            lastSpawned[i] = true;
            lastIndex[i] = index;
          }
          else {
            if (lastIndex[i] !== index) {
              endNoteAnimation(
                `${i}-${lastTick[i]}`,
                playheads[i].hsl,
                svg
              );
              startNoteAnimation(
                x + boxSide * 1.5,
                // x,
                y,
                `${i}-${ticks}`,
                playheads[i].hsl,
                svg
              );
              lastTick[i] = ticks;
              lastSpawned[i] = true;
              lastIndex[i] = index;
            }
          }
          lastSpawned[i] = true;
          lastIndex[i] = index;
        }
      } else {
        // check if note has become not active
        if (lastSpawned[i]) {
          blobCount -= 1;
          endNoteAnimation(`${i}-${lastTick[i]}`, playheads[i].hsl, svg);
        }
        lastSpawned[i] = false;
      }
    }
    if (updatedRef.current <= renderDebounce) {
      setUpdatedCount(updatedRef.current + delta);
      endAllAnimations();
    }
  };

  const animationCallbackRef = useRef(animationCallback);

  useEffect(() => {
    setUpdatedCount(0);
    endAllAnimations();
    animationCallbackRef.current = animationCallback;
  }, [sequence, cps, zoom, height, bounds, playheadCount]);

  useEffect(() => {
    setUpdatedCount(0);
    endAllAnimations();
  }, [playing])


  // main animation loop
  useAnimationFrame(animationCallbackRef);

  var paramSet = 0;
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
      --stroke-width: ${40 * zoom};
        --offset: ${path_offset};
        --start: ${start};
        --end: ${end};
        --initial: ${initial};
        --timeout: ${getAnimationTimeForParam(paramSet)};
        --segment_length: ${segment_length}`
    );

    return newPath;
  };

  var startNoteAnimation = (x, y, id, hsl, svg) => {
    var steps = width / 65;
    // where do the notes appear?
    var points = generatePoints(x, y);
    var d = svgPath(points, bezierCommand);
    var path = createSVGPath(d, "animating", id, hsl);
    if (svg) {
      svg.appendChild(path);
    }
  };

  var endAllAnimations = () => {
    const animating = [...document.querySelectorAll(".animating")];
    let allPaths = animating.length;
    let removedCount = 0;
    if (animating.length) {
      svg = document.querySelector(".svg");
      animating.forEach((path) => {
        var i = path.id.split("-")[0];
        const playhead = playheads[i];
        // console.log(playhead)
        if (playhead) {
          endNoteAnimation(path.id, playhead.hsl, svg);
        } else {
          svg.removeChild(path);
        }
      });
    }

    const remaining = [...document.querySelectorAll(".animating")];
    remaining.forEach((path) => {
      svg.removeChild(path);
    });
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
      --stroke-width: ${40 * zoom};
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
