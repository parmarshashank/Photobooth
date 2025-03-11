'use client';
import { useRef, useEffect } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  countdown: number | null;
}

export default function Camera({ onCapture, countdown }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Camera access is not supported in this browser.");
      return;
    }
  
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const applyVintageFilter = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // First pass: Apply blur
    const blurRadius = 1;
    ctx.filter = `blur(${blurRadius}px)`;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
    if (!tempCtx) return;
    
    tempCtx.drawImage(canvas, 0, 0);
    ctx.drawImage(tempCanvas, 0, 0);
    ctx.filter = 'none';

    // Second pass: Apply B&W and other effects
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Convert to black and white with higher contrast
      const gray = (r * 0.299 + g * 0.587 + b * 0.114);
      const contrast = 1.3; // Increased contrast
      let brightened = Math.min(255, Math.max(0, 
        ((gray - 128) * contrast) + 128
      ));
      
      // Add slight brightness for flash effect
      brightened = Math.min(255, brightened + 15);
      
      data[i] = brightened;
      data[i + 1] = brightened;
      data[i + 2] = brightened;

      // Add vignette and light leak effects
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const dx = (x - centerX) / centerX;
      const dy = (y - centerY) / centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Stronger vignette
      const vignette = Math.pow(Math.cos(Math.min(Math.PI / 2, distance * 1.5)), 2.5);
      
      // Add light leak effect at the top
      const leakIntensity = Math.max(0, 1 - (y / (canvas.height * 0.4)));
      const leak = leakIntensity * 0.15; // Subtle light leak
      
      data[i] = Math.min(255, data[i] * vignette + (leak * 255));
      data[i + 1] = Math.min(255, data[i + 1] * vignette + (leak * 255));
      data[i + 2] = Math.min(255, data[i + 2] * vignette + (leak * 255));
    }

    // Add noise
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 15; // Adjust noise intensity
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
  
    canvas.width = 640;
    canvas.height = 480;
    
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    applyVintageFilter(canvas);
    
    const filteredImageData = canvas.toDataURL('image/jpeg', 0.92);
    onCapture(filteredImageData);
  };

  useEffect(() => {
    if (countdown === null) {
      captureImage();
    }
  }, [countdown]);

  return (
    <div className="relative w-full max-w-sm mx-auto overflow-hidden">
      <div className="h-6 bg-black flex justify-between items-center px-1 border-x-2 border-t-2 border-zinc-700">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-4 h-3 bg-zinc-800 border border-zinc-600"></div>
        ))}
      </div>
      
      <div className="relative aspect-[4/3] border-x-2 border-zinc-700 bg-black">
        <div className="absolute inset-0 pointer-events-none z-10 bg-[url('/scratch-overlay.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="absolute inset-0 pointer-events-none z-10 bg-[url('/dust-overlay.png')] opacity-5"></div>
        
        <video 
          ref={videoRef} 
          autoPlay 
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-2 right-2 text-amber-500 text-xs font-mono opacity-70">
          3A ▲
        </div>
        
        {countdown && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-5xl font-bold text-white bg-black/50 w-20 h-20 flex items-center justify-center animate-pulse rounded-full">
              {countdown}
            </div>
          </div>
        )}
      </div>
      
      <div className="h-6 bg-black flex justify-between items-center px-1 border-x-2 border-b-2 border-zinc-700">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-4 h-3 bg-zinc-800 border border-zinc-600"></div>
        ))}
      </div>
    </div>
  );
}