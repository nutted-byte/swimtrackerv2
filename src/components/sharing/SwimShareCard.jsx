import { Activity, Clock, Zap, TrendingUp, Award, Waves, Droplets } from 'lucide-react';
import { ShareableCard } from './ShareableCard';
import { forwardRef } from 'react';

/**
 * Beautiful swim share card for social media
 * Displays key swim metrics with Swimma branding
 */
export const SwimShareCard = forwardRef(({
  swim,
  showWatermark = true,
  format = 'square'
}, ref) => {

  // Format functions
  const formatPace = (pace) => {
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.round(duration % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `0:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <ShareableCard ref={ref} format={format} showWatermark={showWatermark}>
      {/* Animated wave background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(0, 212, 255, 0.4) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(0, 125, 155, 0.5) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 h-full flex flex-col" style={{ padding: '70px' }}>
        {/* Header with date */}
        <div className="flex items-center justify-between" style={{ marginBottom: '80px' }}>
          <div className="flex items-center gap-4">
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '28px',
              background: 'linear-gradient(135deg, #007d9b 0%, #3397af 50%, #00d4ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '52px',
              boxShadow: '0 20px 60px rgba(0, 125, 155, 0.4)',
              border: '3px solid rgba(255, 255, 255, 0.15)'
            }}>
              🏊‍♂️
            </div>
            <div>
              <h1 className="text-white font-bold font-display tracking-tight" style={{
                fontSize: '56px',
                lineHeight: '1',
                marginBottom: '8px'
              }}>
                Swimma
              </h1>
              <p className="text-gray-400" style={{ fontSize: '22px' }}>Swim Tracker</p>
            </div>
          </div>

          {/* Date at top right - no box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span className="font-display" style={{
              color: '#d1d5db',
              fontSize: '28px',
              fontWeight: '600'
            }}>
              {formatDate(swim.date)}
            </span>
          </div>
        </div>

        {/* 2x2 Grid Layout - FIXED SIZES */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '420px 420px',
          gridTemplateRows: '340px 200px',
          gap: '40px',
          justifyContent: 'center'
        }}>
          {/* Distance - Top Left */}
          <div style={{
            position: 'relative',
            width: '420px',
            height: '340px',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 125, 155, 0.1))',
            borderRadius: '32px',
            backdropFilter: 'blur(20px)',
            border: '3px solid rgba(0, 212, 255, 0.3)',
            boxShadow: 'inset 0 0 60px rgba(0, 212, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: '100%'
            }}>
              <div style={{
                color: '#66b1c3',
                fontSize: '20px',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                DISTANCE
              </div>
              <div className="font-display" style={{
                color: 'white',
                fontSize: '110px',
                lineHeight: '1',
                fontWeight: '900',
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(0, 212, 255, 0.8)',
                marginBottom: '8px'
              }}>
                {swim.distance}
              </div>
              <div style={{
                color: '#d1d5db',
                fontSize: '28px',
                fontWeight: '700'
              }}>
                meters
              </div>
            </div>
          </div>

          {/* Duration - Top Right */}
          <div style={{
            position: 'relative',
            width: '420px',
            height: '340px',
            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 125, 155, 0.1))',
            borderRadius: '32px',
            backdropFilter: 'blur(20px)',
            border: '3px solid rgba(0, 212, 255, 0.3)',
            boxShadow: 'inset 0 0 60px rgba(0, 212, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: '100%'
            }}>
              <div style={{
                color: '#66b1c3',
                fontSize: '20px',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontWeight: '700',
                marginBottom: '10px'
              }}>
                DURATION
              </div>
              <div className="font-display" style={{
                color: 'white',
                fontSize: '110px',
                fontWeight: '900',
                lineHeight: '1',
                letterSpacing: '-0.02em',
                textShadow: '0 0 40px rgba(0, 212, 255, 0.8)',
                fontFeatureSettings: '"tnum"',
                marginBottom: '8px'
              }}>
                {formatDuration(swim.duration)}
              </div>
              <div style={{
                color: 'transparent',
                fontSize: '28px',
                fontWeight: '700',
                height: '28px'
              }}>
                &nbsp;
              </div>
            </div>
          </div>

          {/* Pace - Bottom Left */}
          {swim.pace && (
            <div style={{
              position: 'relative',
              width: '420px',
              height: '200px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              borderRadius: '32px',
              backdropFilter: 'blur(20px)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '100%'
              }}>
                <div style={{
                  color: '#9ca3af',
                  fontSize: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  PACE
                </div>
                <div className="font-display" style={{
                  color: 'white',
                  fontSize: '70px',
                  fontWeight: '900',
                  lineHeight: '1',
                  fontFeatureSettings: '"tnum"',
                  marginBottom: '6px'
                }}>
                  {formatPace(swim.pace)}
                </div>
                <div style={{
                  color: '#6b7280',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  /100m
                </div>
              </div>
            </div>
          )}

          {/* SWOLF - Bottom Right */}
          {swim.swolf > 0 && (
            <div style={{
              position: 'relative',
              width: '420px',
              height: '200px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              borderRadius: '32px',
              backdropFilter: 'blur(20px)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '100%'
              }}>
                <div style={{
                  color: '#9ca3af',
                  fontSize: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '3px',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}>
                  SWOLF
                </div>
                <div className="font-display" style={{
                  color: 'white',
                  fontSize: '70px',
                  fontWeight: '900',
                  lineHeight: '1',
                  fontFeatureSettings: '"tnum"',
                  marginBottom: '6px'
                }}>
                  {swim.swolf}
                </div>
                <div style={{
                  color: 'transparent',
                  fontSize: '20px',
                  fontWeight: '600',
                  height: '20px'
                }}>
                  &nbsp;
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ShareableCard>
  );
});

SwimShareCard.displayName = 'SwimShareCard';
