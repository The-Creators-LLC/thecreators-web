import { Box } from "@chakra-ui/react";
import { useMemo } from "react";

/**
 * This component replicates the HTML/CSS from the 'hyperspace_test' folder.
 * We wrap everything in a Box and use <style jsx global> for animations.
 * The 'visible' prop controls a fade transition between 0 and 1 opacity.
 */
export default function Hyperspace({ visible }: { visible: boolean }) {
  // We'll apply a CSS class "visible" or "hidden" to control fade in/out.
  const containerClass = useMemo(
    () =>
      visible ? "hyperspace-container visible" : "hyperspace-container hidden",
    [visible]
  );

  return (
    <>
      <Box
        className={containerClass}
        position="fixed"
        top="0"
        left="0"
        width="100vw"
        height="100vh"
        zIndex={0}
        overflow="hidden"
        pointerEvents="none"
      >
        {/* This HTML structure matches the original hyperspace_test/index.html */}
        <div className="scene">
          <div className="wrap">
            <div className="wall wall-right"></div>
            <div className="wall wall-left"></div>
            <div className="wall wall-top"></div>
            <div className="wall wall-bottom"></div>
            <div className="wall wall-back"></div>
          </div>
          <div className="wrap">
            <div className="wall wall-right"></div>
            <div className="wall wall-left"></div>
            <div className="wall wall-top"></div>
            <div className="wall wall-bottom"></div>
            <div className="wall wall-back"></div>
          </div>
        </div>
      </Box>

      {/* Global styles for the hyperspace animations */}
      <style jsx global>{`
        /* Container fade in/out */
        .hyperspace-container {
          opacity: 0.5;
          transition: opacity 7.41s ease;
        }
        .hyperspace-container.hidden {
          opacity: 0;
        }
        .hyperspace-container.visible {
          opacity: 0.8;
        }

        /* Hyperspace animations taken from index.css */
        .scene {
          display: block;
          perspective: 6px;
          perspective-origin: 74% 74%;
          position: relative;
          width: 100%;
          height: 100%;
        }

        .wrap {
          position: absolute;
          width: 741px;
          height: 741px;
          left: 0%;
          top: 0%;
          transform: translate(-50%, -50%);
          transform-style: preserve-3d;
          animation: move 27s infinite linear;
          animation-fill-mode: forwards;
        }

        /* The second wrap is identical, but we add an animation-delay for a staggered effect. */
        .scene > .wrap:nth-child(2) {
          animation-delay: 6s;
        }

        .wall {
          width: 100%;
          height: 100%;
          position: absolute;
          opacity: 0;
          background: url("/stars.png");
          background-size: cover;
          animation: fade 12s infinite linear;
        }

        /* The second wrap's walls get a 6s delay as well */
        .scene > .wrap:nth-child(2) .wall {
          animation-delay: 6s;
        }

        .wall-right {
          transform: rotateY(90deg) translateZ(500px);
        }
        .wall-left {
          transform: rotateY(-90deg) translateZ(500px);
        }
        .wall-top {
          transform: rotateX(90deg) translateZ(500px);
        }
        .wall-bottom {
          transform: rotateX(-90deg) translateZ(500px);
        }
        .wall-back {
          transform: rotateX(180deg) translateZ(500px);
        }

        @keyframes move {
          0% {
            transform: translateZ(-200px) rotate(0deg);
          }
          100% {
            transform: translateZ(200px) rotate(0deg);
          }
        }

        @keyframes fade {
          0% {
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
