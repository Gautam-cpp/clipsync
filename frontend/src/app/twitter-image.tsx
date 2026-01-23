import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ClipSync - Sync Clipboard & Transfer Files Instantly';
export const size = {
    width: 1200,
    height: 600,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(45, 212, 191, 0.3) 0%, transparent 50%)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '50px',
                    }}
                >
                    <div
                        style={{
                            fontSize: 72,
                            fontWeight: 900,
                            background: 'linear-gradient(to right, #8b5cf6, #2dd4bf)',
                            backgroundClip: 'text',
                            color: 'transparent',
                            marginBottom: 20,
                            textAlign: 'center',
                        }}
                    >
                        ClipSync
                    </div>
                    <div
                        style={{
                            fontSize: 36,
                            color: '#e5e5e5',
                            textAlign: 'center',
                            maxWidth: 800,
                            lineHeight: 1.3,
                        }}
                    >
                        Sync Clipboard & Transfer Files Instantly
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            color: '#a3a3a3',
                            textAlign: 'center',
                            marginTop: 25,
                        }}
                    >
                        Real-time • Secure • No Login Required
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
