import { Activity, Clock, Zap, TrendingUp, Award, Waves, Droplets, Timer } from 'lucide-react';
import { ShareableCard } from './ShareableCard';
import { forwardRef } from 'react';
import { EXPORT_COLORS } from '../../utils/constants';

/**
 * Beautiful swim share card for social media
 * Displays key swim metrics with Swimma branding
 */
export const SwimShareCard = forwardRef(({
  swim,
  showWatermark = true,
  format = 'square',
  style = 'bold' // 'bold', 'minimal', 'gradient'
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

  // Render different card styles based on format and style
  if (format === 'story') {
    return renderStoryCard();
  }

  if (style === 'minimal') {
    return renderMinimalCard();
  }

  if (style === 'gradient') {
    return renderGradientCard();
  }

  // Default: Bold card
  return renderBoldCard();

  // Story Format (9:16) - Optimized for Instagram/WhatsApp Stories
  function renderStoryCard() {
    return (
      <ShareableCard ref={ref} format={format} showWatermark={showWatermark}>
        {/* Gradient Background */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${EXPORT_COLORS.BG_DARK} 0%, ${EXPORT_COLORS.BG_DARK_ALT} 50%, ${EXPORT_COLORS.BG_DARK_ALT2} 100%)`
        }} />

        {/* Animated wave effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div style={{
            position: 'absolute',
            top: '10%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${EXPORT_COLORS.BRAND_ACCENT}4D 0%, transparent 70%)`,
            filter: 'blur(60px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            left: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0, 125, 155, 0.4) 0%, transparent 70%)', // Darker teal
            filter: 'blur(60px)'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between" style={{ padding: '80px 60px' }}>
          {/* Header */}
          <div className="text-center">
            <div style={{
              fontSize: '80px',
              marginBottom: '20px'
            }}>
              🏊‍♂️
            </div>
            <h1 className="font-display" style={{
              fontSize: '48px',
              fontWeight: '900',
              color: 'white',
              letterSpacing: '-0.02em',
              marginBottom: '12px'
            }}>
              Swimma
            </h1>
            <p style={{
              fontSize: '24px',
              color: EXPORT_COLORS.TEXT_TERTIARY
            }}>
              Swim Tracker
            </p>
          </div>

          {/* Main Metric - Distance */}
          <div style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            margin: '60px 0'
          }}>
            <div style={{
              color: EXPORT_COLORS.BRAND_TEAL,
              fontSize: '24px',
              textTransform: 'uppercase',
              letterSpacing: '4px',
              fontWeight: '700'
            }}>
              DISTANCE
            </div>
            <div className="font-display" style={{
              color: EXPORT_COLORS.TEXT_PRIMARY,
              fontSize: '140px',
              lineHeight: '1',
              fontWeight: '900',
              letterSpacing: '-0.02em',
              textShadow: `0 0 60px ${EXPORT_COLORS.BRAND_ACCENT}CC`
            }}>
              {swim.distance}
            </div>
            <div style={{
              color: EXPORT_COLORS.TEXT_SECONDARY,
              fontSize: '32px',
              fontWeight: '700'
            }}>
              meters
            </div>
          </div>

          {/* Secondary Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '40px'
          }}>
            {/* Duration */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '24px',
              padding: '32px 24px',
              textAlign: 'center',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}>
              <div style={{
                color: EXPORT_COLORS.TEXT_TERTIARY,
                fontSize: '16px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '700'
              }}>
                TIME
              </div>
              <div className="font-display" style={{
                color: EXPORT_COLORS.TEXT_PRIMARY,
                fontSize: '48px',
                fontWeight: '900',
                lineHeight: '1'
              }}>
                {formatDuration(swim.duration)}
              </div>
            </div>

            {/* Pace */}
            {swim.pace && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '32px 24px',
                textAlign: 'center',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
              }}>
                <div style={{
                  color: EXPORT_COLORS.TEXT_TERTIARY,
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: '700'
                }}>
                  PACE
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <div className="font-display" style={{
                    color: EXPORT_COLORS.TEXT_PRIMARY,
                    fontSize: '48px',
                    fontWeight: '900',
                    lineHeight: '1'
                  }}>
                    {formatPace(swim.pace)}
                  </div>
                  <span style={{ fontSize: '20px', color: EXPORT_COLORS.TEXT_MUTED, fontWeight: '600' }}>/100m</span>
                </div>
              </div>
            )}
          </div>

          {/* Date */}
          <div className="text-center" style={{
            color: EXPORT_COLORS.TEXT_TERTIARY,
            fontSize: '22px',
            fontWeight: '600'
          }}>
            {formatDate(swim.date)}
          </div>
        </div>
      </ShareableCard>
    );
  }

  // Minimal Card - Clean and simple
  function renderMinimalCard() {
    return (
      <ShareableCard ref={ref} format={format} showWatermark={showWatermark}>
        {/* Simple gradient background */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${EXPORT_COLORS.BG_LIGHT} 0%, ${EXPORT_COLORS.BG_LIGHT_ALT} 100%)`
        }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center" style={{ padding: '70px' }}>
          {/* Header */}
          <div className="text-center" style={{ marginBottom: '80px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏊‍♂️</div>
            <h1 className="font-display" style={{
              fontSize: '42px',
              fontWeight: '900',
              color: EXPORT_COLORS.TEXT_DARK,
              letterSpacing: '-0.02em'
            }}>
              {swim.distance}m swim
            </h1>
            <p style={{
              fontSize: '22px',
              color: EXPORT_COLORS.TEXT_MUTED,
              marginTop: '8px'
            }}>
              {formatDate(swim.date)}
            </p>
          </div>

          {/* Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px'
          }}>
            {/* Duration */}
            <div className="text-center">
              <div style={{
                color: EXPORT_COLORS.TEXT_MUTED,
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '700',
                marginBottom: '12px'
              }}>
                Duration
              </div>
              <div className="font-display" style={{
                color: EXPORT_COLORS.TEXT_DARK,
                fontSize: '56px',
                fontWeight: '900',
                lineHeight: '1'
              }}>
                {formatDuration(swim.duration)}
              </div>
            </div>

            {/* Pace */}
            {swim.pace && (
              <div className="text-center">
                <div style={{
                  color: EXPORT_COLORS.TEXT_MUTED,
                  fontSize: '18px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: '700',
                  marginBottom: '12px'
                }}>
                  Pace
                </div>
                <div className="font-display" style={{
                  color: EXPORT_COLORS.TEXT_DARK,
                  fontSize: '56px',
                  fontWeight: '900',
                  lineHeight: '1'
                }}>
                  {formatPace(swim.pace)}
                  <div style={{ fontSize: '20px', color: EXPORT_COLORS.TEXT_TERTIARY, marginTop: '8px' }}>/100m</div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom branding */}
          <div className="text-center" style={{ marginTop: '80px' }}>
            <p className="font-display" style={{
              fontSize: '24px',
              fontWeight: '700',
              color: EXPORT_COLORS.BRAND_PRIMARY
            }}>
              Tracked with Swimma
            </p>
          </div>
        </div>
      </ShareableCard>
    );
  }

  // Gradient Card - Vibrant and colorful
  function renderGradientCard() {
    return (
      <ShareableCard ref={ref} format={format} showWatermark={showWatermark}>
        {/* Vibrant gradient background */}
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, ${EXPORT_COLORS.GRADIENT_PURPLE} 0%, ${EXPORT_COLORS.GRADIENT_PURPLE_DARK} 25%, ${EXPORT_COLORS.GRADIENT_PINK} 50%, ${EXPORT_COLORS.GRADIENT_BLUE} 75%, ${EXPORT_COLORS.GRADIENT_CYAN} 100%)`
        }} />

        {/* Overlay for readability */}
        <div className="absolute inset-0" style={{
          background: 'rgba(0, 0, 0, 0.3)'
        }} />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col" style={{ padding: '70px' }}>
          {/* Header */}
          <div style={{ marginBottom: '60px' }}>
            <div className="flex items-center gap-4 mb-4">
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px',
                border: '3px solid rgba(255, 255, 255, 0.3)'
              }}>
                🏊‍♂️
              </div>
              <div>
                <h1 className="font-display" style={{
                  fontSize: '52px',
                  fontWeight: '900',
                  color: 'white',
                  letterSpacing: '-0.02em',
                  lineHeight: '1',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}>
                  Swimma
                </h1>
              </div>
            </div>
            <p style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '600'
            }}>
              {formatDate(swim.date)}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Distance - Hero */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(30px)',
              borderRadius: '32px',
              padding: '48px',
              textAlign: 'center',
              marginBottom: '32px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '22px',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontWeight: '700',
                marginBottom: '16px'
              }}>
                DISTANCE
              </div>
              <div className="font-display" style={{
                color: 'white',
                fontSize: '120px',
                lineHeight: '1',
                fontWeight: '900',
                letterSpacing: '-0.02em',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                marginBottom: '8px'
              }}>
                {swim.distance}
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '28px',
                fontWeight: '700'
              }}>
                meters
              </div>
            </div>

            {/* Secondary metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: swim.pace && swim.swolf > 0 ? '1fr 1fr 1fr' : '1fr 1fr',
              gap: '24px'
            }}>
              {/* Duration */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(30px)',
                borderRadius: '24px',
                padding: '32px 24px',
                textAlign: 'center',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  fontWeight: '700',
                  marginBottom: '10px'
                }}>
                  TIME
                </div>
                <div className="font-display" style={{
                  color: 'white',
                  fontSize: '52px',
                  fontWeight: '900',
                  lineHeight: '1',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}>
                  {formatDuration(swim.duration)}
                </div>
              </div>

              {/* Pace */}
              {swim.pace && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontWeight: '700',
                    marginBottom: '10px'
                  }}>
                    PACE
                  </div>
                  <div className="font-display" style={{
                    color: 'white',
                    fontSize: '52px',
                    fontWeight: '900',
                    lineHeight: '1',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}>
                    {formatPace(swim.pace)}
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginTop: '6px',
                    fontWeight: '600'
                  }}>
                    /100m
                  </div>
                </div>
              )}

              {/* SWOLF */}
              {swim.swolf > 0 && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(30px)',
                  borderRadius: '24px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontWeight: '700',
                    marginBottom: '10px'
                  }}>
                    SWOLF
                  </div>
                  <div className="font-display" style={{
                    color: 'white',
                    fontSize: '52px',
                    fontWeight: '900',
                    lineHeight: '1',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}>
                    {swim.swolf}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </ShareableCard>
    );
  }

  // Bold Card - Default style with strong visual hierarchy
  function renderBoldCard() {
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
              background: `linear-gradient(135deg, ${EXPORT_COLORS.BRAND_PRIMARY} 0%, ${EXPORT_COLORS.BRAND_SECONDARY} 50%, ${EXPORT_COLORS.BRAND_ACCENT} 100%)`,
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
              <p className="text-content-tertiary" style={{ fontSize: '22px' }}>Swim Tracker</p>
            </div>
          </div>

          {/* Date at top right - no box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span className="font-display" style={{
              color: EXPORT_COLORS.TEXT_SECONDARY,
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
            background: `linear-gradient(135deg, ${EXPORT_COLORS.BRAND_ACCENT}26, rgba(0, 125, 155, 0.1))`,
            borderRadius: '32px',
            backdropFilter: 'blur(20px)',
            border: `3px solid ${EXPORT_COLORS.BRAND_ACCENT}4D`,
            boxShadow: 'inset 0 0 60px rgba(0, 212, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Label - top */}
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '0',
              right: '0',
              textAlign: 'center',
              color: EXPORT_COLORS.BRAND_TEAL,
              fontSize: '20px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              fontWeight: '700'
            }}>
              DISTANCE
            </div>

            {/* Number - centered */}
            <div className="font-display" style={{
              position: 'absolute',
              top: '37%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '110px',
              lineHeight: '0.85',
              fontWeight: '900',
              letterSpacing: '-0.02em',
              textShadow: `0 0 40px ${EXPORT_COLORS.BRAND_ACCENT}CC`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {swim.distance}
            </div>

            {/* Unit - bottom */}
            <div style={{
              position: 'absolute',
              bottom: '90px',
              left: '0',
              right: '0',
              textAlign: 'center',
              color: EXPORT_COLORS.TEXT_SECONDARY,
              fontSize: '28px',
              fontWeight: '700'
            }}>
              meters
            </div>
          </div>

          {/* Duration - Top Right */}
          <div style={{
            position: 'relative',
            width: '420px',
            height: '340px',
            background: `linear-gradient(135deg, ${EXPORT_COLORS.BRAND_ACCENT}26, rgba(0, 125, 155, 0.1))`,
            borderRadius: '32px',
            backdropFilter: 'blur(20px)',
            border: `3px solid ${EXPORT_COLORS.BRAND_ACCENT}4D`,
            boxShadow: 'inset 0 0 60px rgba(0, 212, 255, 0.1), 0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Label - top */}
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '0',
              right: '0',
              textAlign: 'center',
              color: EXPORT_COLORS.BRAND_TEAL,
              fontSize: '20px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
              fontWeight: '700'
            }}>
              DURATION
            </div>

            {/* Number - centered */}
            <div className="font-display" style={{
              position: 'absolute',
              top: '37%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '110px',
              fontWeight: '900',
              lineHeight: '0.85',
              letterSpacing: '-0.02em',
              textShadow: `0 0 40px ${EXPORT_COLORS.BRAND_ACCENT}CC`,
              fontFeatureSettings: '"tnum"',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {formatDuration(swim.duration)}
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
              {/* Label - top */}
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '0',
                right: '0',
                textAlign: 'center',
                color: EXPORT_COLORS.TEXT_TERTIARY,
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontWeight: '700'
              }}>
                PACE
              </div>

              {/* Number - centered */}
              <div className="font-display" style={{
                position: 'absolute',
                top: '37%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '70px',
                fontWeight: '900',
                lineHeight: '0.85',
                fontFeatureSettings: '"tnum"',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {formatPace(swim.pace)}
              </div>

              {/* Unit - bottom */}
              <div style={{
                position: 'absolute',
                bottom: '35px',
                left: '0',
                right: '0',
                textAlign: 'center',
                color: EXPORT_COLORS.TEXT_MUTED,
                fontSize: '20px',
                fontWeight: '600'
              }}>
                /100m
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
              {/* Label - top */}
              <div style={{
                position: 'absolute',
                top: '30px',
                left: '0',
                right: '0',
                textAlign: 'center',
                color: EXPORT_COLORS.TEXT_TERTIARY,
                fontSize: '18px',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontWeight: '700'
              }}>
                SWOLF
              </div>

              {/* Number - centered */}
              <div className="font-display" style={{
                position: 'absolute',
                top: '37%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '70px',
                fontWeight: '900',
                lineHeight: '0.85',
                fontFeatureSettings: '"tnum"',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {swim.swolf}
              </div>
            </div>
          )}
        </div>
      </div>
    </ShareableCard>
    );
  }
});

SwimShareCard.displayName = 'SwimShareCard';
