import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";

export type ScannerStatus = "idle" | "scanning" | "found" | "error";

interface UseQrScannerResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  status: ScannerStatus;
  data: string | null;
  error: string | null;
  reset: () => void;
}

export function useQrScanner(): UseQrScannerResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const lastFoundRef = useRef<string>("");
  const lastFoundTimeRef = useRef<number>(0);

  const [status, setStatus] = useState<ScannerStatus>("idle");
  const [data, setData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setStatus("scanning");
    lastFoundRef.current = "";
    lastFoundTimeRef.current = 0;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();
        setStatus("scanning");

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        function scan() {
          if (cancelled) return;

          const v = videoRef.current;
          const c = canvasRef.current;
          if (!v || !c || !ctx || v.readyState !== v.HAVE_ENOUGH_DATA) {
            rafRef.current = requestAnimationFrame(scan);
            return;
          }

          c.width = v.videoWidth;
          c.height = v.videoHeight;
          ctx.drawImage(v, 0, 0, c.width, c.height);

          const imageData = ctx.getImageData(0, 0, c.width, c.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code?.data) {
            const now = Date.now();
            // Debounce: ignore same result within 1.5s
            if (
              code.data !== lastFoundRef.current ||
              now - lastFoundTimeRef.current > 1500
            ) {
              lastFoundRef.current = code.data;
              lastFoundTimeRef.current = now;
              setData(code.data);
              setStatus("found");
              return; // stop scanning loop on find
            }
          }

          rafRef.current = requestAnimationFrame(scan);
        }

        rafRef.current = requestAnimationFrame(scan);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof DOMException && err.name === "NotAllowedError"
              ? "permission-denied"
              : "camera-error",
          );
          setStatus("error");
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      stopStream();
    };
  }, [stopStream]);

  // Restart scanning loop when reset is called
  useEffect(() => {
    if (status !== "scanning" || !videoRef.current || !canvasRef.current)
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let cancelled = false;

    function scan() {
      if (cancelled) return;
      const v = videoRef.current;
      const c = canvasRef.current;
      if (!v || !c || !ctx || v.readyState !== v.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(scan);
        return;
      }

      c.width = v.videoWidth;
      c.height = v.videoHeight;
      ctx.drawImage(v, 0, 0, c.width, c.height);

      const imageData = ctx.getImageData(0, 0, c.width, c.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code?.data) {
        const now = Date.now();
        if (
          code.data !== lastFoundRef.current ||
          now - lastFoundTimeRef.current > 1500
        ) {
          lastFoundRef.current = code.data;
          lastFoundTimeRef.current = now;
          setData(code.data);
          setStatus("found");
          return;
        }
      }

      rafRef.current = requestAnimationFrame(scan);
    }

    // Small delay to let the state settle
    const timer = setTimeout(() => {
      if (!cancelled && video.readyState >= video.HAVE_ENOUGH_DATA) {
        rafRef.current = requestAnimationFrame(scan);
      }
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [status]);

  return { videoRef, canvasRef, status, data, error, reset };
}
