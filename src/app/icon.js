import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#09090b', // A sleek dark color
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          borderRadius: '6px',
          fontWeight: 700,
          fontFamily: 'serif', // Fallback to serif for a premium look
        }}
      >
        BI
      </div>
    ),
    {
      ...size,
    }
  );
}
