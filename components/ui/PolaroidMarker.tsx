'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Marker } from 'react-map-gl/mapbox';
import { Camera } from 'lucide-react';
import type { SpotMarker } from '@/lib/spot-data';

interface PolaroidMarkerProps {
  spot: SpotMarker;
  index: number;            // stagger delay: index × 150ms
  onSpotClick: (spot: SpotMarker) => void;
}

export function PolaroidMarker({ spot, index, onSpotClick }: PolaroidMarkerProps) {
  const [hovered, setHovered] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSpotClick(spot);
      }
    },
    [spot, onSpotClick]
  );

  return (
    <Marker
      longitude={spot.coordinates[0]}
      latitude={spot.coordinates[1]}
      anchor="bottom"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
          delay: index * 0.15,
        }}
        style={{ zIndex: 40 }}
      >
        {/* Polaroid card */}
        <div
          role="button"
          tabIndex={0}
          aria-label={`View photo: ${spot.name}`}
          onClick={() => onSpotClick(spot)}
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: '#fffef9',
            padding: '8px 8px 24px 8px',
            boxShadow: hovered
              ? '4px 8px 24px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.3)'
              : '2px 4px 16px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            position: 'relative',
            width: '176px',
            transform: hovered
              ? 'rotate(0deg) scale(1.05)'
              : `rotate(${spot.rotation}deg) scale(1)`,
            transition: 'transform 200ms ease, box-shadow 200ms ease',
            zIndex: hovered ? 50 : 40,
          }}
        >
          {/* Gold pin dot at top-center */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#c9a84c',
              boxShadow: '0 0 6px rgba(201,168,76,0.6)',
            }}
          />

          {/* Image placeholder area — 160×120px */}
          <div
            style={{
              width: '160px',
              height: '120px',
              background: '#0a0f1a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Camera
              style={{ width: '22px', height: '22px', color: '#c9a84c', opacity: 0.55 }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '9px',
                color: '#c9a84c',
                opacity: 0.7,
                textAlign: 'center',
                padding: '0 8px',
                lineHeight: 1.4,
              }}
            >
              {spot.name}
            </span>
          </div>

          {/* Caption area */}
          <div style={{ padding: '6px 4px 0' }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '13px',
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {spot.name}
            </p>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '10px',
                color: '#666',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {spot.description}
            </p>
          </div>
        </div>
      </motion.div>
    </Marker>
  );
}
