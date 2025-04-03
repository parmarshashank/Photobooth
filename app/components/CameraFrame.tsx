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
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const photoSequenceRef = useRef(0);

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
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full rounded-2xl"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user"
            }}
          />
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