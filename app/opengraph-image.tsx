import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Trip to Bangladesh — Expert Guided Tours';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0f1a',
          position: 'relative',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Gold border frame */}
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: '1.5px solid rgba(201,168,76,0.4)',
            display: 'flex',
          }}
        />
        {/* Inner thin frame */}
        <div
          style={{
            position: 'absolute',
            inset: '32px',
            border: '0.5px solid rgba(201,168,76,0.2)',
            display: 'flex',
          }}
        />

        {/* Top decorative line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div style={{ width: '80px', height: '1px', backgroundColor: '#c9a84c', opacity: 0.6, display: 'flex' }} />
          <div style={{ width: '6px', height: '6px', backgroundColor: '#c9a84c', borderRadius: '50%', display: 'flex' }} />
          <div style={{ width: '80px', height: '1px', backgroundColor: '#c9a84c', opacity: 0.6, display: 'flex' }} />
        </div>

        {/* Main heading */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: '600',
            color: '#c9a84c',
            letterSpacing: '0.08em',
            textAlign: 'center',
            lineHeight: 1.15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span>TRIP TO</span>
          <span>BANGLADESH</span>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
          <div style={{ width: '120px', height: '1px', backgroundColor: 'rgba(201,168,76,0.4)', display: 'flex' }} />
          <div style={{ width: '4px', height: '4px', backgroundColor: 'rgba(201,168,76,0.6)', transform: 'rotate(45deg)', display: 'flex' }} />
          <div style={{ width: '120px', height: '1px', backgroundColor: 'rgba(201,168,76,0.4)', display: 'flex' }} />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '26px',
            color: '#f5f0e8',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: 'Georgia, serif',
            fontWeight: '300',
            display: 'flex',
          }}
        >
          Expert Guided Tours Since 2000
        </div>

        {/* Bottom attribution */}
        <div
          style={{
            position: 'absolute',
            bottom: '56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(201,168,76,0.7)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'flex',
            }}
          >
            Recognized by Lonely Planet
          </div>

          <div
            style={{
              fontSize: '14px',
              color: 'rgba(168,159,140,0.6)',
              letterSpacing: '0.12em',
              display: 'flex',
            }}
          >
            trip2bangladesh.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
