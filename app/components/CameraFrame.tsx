'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { CameraIcon, SparklesIcon, PhotoIcon } from '@heroicons/react/24/solid';

interface CameraFrameProps {
  onPhotoCapture: (photoData: string) => void;
  photosCount: number;
}

export default function CameraFrame({ onPhotoCapture, photosCount }: CameraFrameProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showFlash, setShowFlash] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const photoSequenceRef = useRef(0);

  // Define video constraints
  const videoConstraints = {
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
    facingMode: { ideal: "user" },
    aspectRatio: 16/9
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150);
      
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onPhotoCapture(imageSrc);
        photoSequenceRef.current += 1;

        // Start next photo sequence if not done
        if (photoSequenceRef.current < 3) {
          setTimeout(() => {
            setIsCountingDown(true);
            setCountdown(3);
          }, 500);
        }
      }
    }
  }, [onPhotoCapture]);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountingDown(false);
      setCountdown(3);
      capture();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isCountingDown, countdown, capture]);

  const startCountdown = useCallback(() => {
    photoSequenceRef.current = 0;
    setIsCountingDown(true);
    setCountdown(3);
    setCameraError(null);
  }, []);

  const handleUserMediaError = useCallback((error: string | DOMException) => {
    console.error('Camera error:', error);
    let errorMessage = 'Could not access camera. Please ensure you have granted camera permissions.';
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Camera access was denied. Please allow camera access in your browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No camera device was found on your device.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Could not access your camera. It may be in use by another application.';
      }
    }
    setCameraError(errorMessage);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="camera-frame grain">
        <div className="absolute top-4 right-4 flex space-x-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 text-pink-400"
          >
            <SparklesIcon />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-8 h-8 text-pink-400"
          >
            <PhotoIcon />
          </motion.div>
        </div>
        
        <div className="relative">
          {cameraError ? (
            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center p-4">
              <div className="text-center text-gray-600">
                <p className="mb-2">{cameraError}</p>
                <button
                  onClick={() => {
                    setCameraError(null);
                    if (webcamRef.current) {
                      webcamRef.current.stream = null;
                    }
                  }}
                  className="text-pink-500 hover:text-pink-600 font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-2xl"
              videoConstraints={videoConstraints}
              onUserMediaError={handleUserMediaError}
              mirrored
            />
          )}
          <AnimatePresence>
            {showFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white"
                style={{ mixBlendMode: 'overlay' }}
              />
            )}
          </AnimatePresence>
        </div>

        {isCountingDown && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.span
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text-6xl font-bold text-white drop-shadow-lg"
            >
              {countdown}
            </motion.span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startCountdown}
          className="button-3d absolute bottom-4 left-1/2 transform -translate-x-1/2"
          disabled={isCountingDown || photosCount >= 3}
        >
          <CameraIcon className="w-6 h-6 mr-2 inline-block" />
          {photosCount >= 3 ? 'Strip Complete!' : 'Take Photos'}
        </motion.button>
      </div>
    </div>
  );
} 