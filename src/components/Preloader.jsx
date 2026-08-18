import React, { useState, useEffect, useRef } from 'react';
import { LogoIcon } from './Logo';

const CURRENCIES = [
  { sym: '$', name: 'USD' },
  { sym: '€', name: 'EUR' },
  { sym: '£', name: 'GBP' },
  { sym: '¥', name: 'JPY' },
  { sym: '₿', name: 'BTC' },
  { sym: '₩', name: 'KRW' },
  { sym: 'A$', name: 'AUD' },
  { sym: 'د.إ', name: 'AED' },
  { sym: '₽', name: 'RUB' },
  { sym: 'CHF', name: 'CHF' },
  { sym: '₹', name: 'INR' }, // Target lock
];

const Preloader = ({ onFinish }) => {
  // stages: 'cycling' -> 'locked_rupee' -> 'show_logo' -> 'expand_text' -> 'exit'
  const [stage, setStage] = useState('cycling');
  const [currIndex, setCurrIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const timerIds = useRef([]);

  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timerIds.current.push(id);
    return id;
  };

  useEffect(() => {
    let count = 0;
    const totalCycles = 14;
    let delay = 50;

    const cycleNext = () => {
      count++;
      setCurrIndex((prev) => (prev + 1) % (CURRENCIES.length - 1));
      setProgress(Math.min(65, Math.round((count / totalCycles) * 65)));

      if (count < totalCycles) {
        delay += 12; // smoothly decelerate
        addTimeout(cycleNext, delay);
      } else {
        // 1. Snap & Lock on Indian Rupee (₹)
        setCurrIndex(CURRENCIES.length - 1);
        setProgress(75);
        setStage('locked_rupee');

        // 2. Morph into ExpenseFlow Logo
        addTimeout(() => {
          setStage('show_logo');
          setProgress(90);

          // 3. Expand ExpenseFlow text
          addTimeout(() => {
            setStage('expand_text');
            setProgress(100);

            // 4. Fade & scale curtain open
            addTimeout(() => {
              setStage('exit');
              addTimeout(() => {
                if (onFinishRef.current) onFinishRef.current();
              }, 500);
            }, 800);
          }, 500);
        }, 600);
      }
    };

    addTimeout(cycleNext, delay);

    return () => {
      timerIds.current.forEach((id) => clearTimeout(id));
      timerIds.current = [];
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#080b11',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s ease',
        opacity: stage === 'exit' ? 0 : 1,
        transform: stage === 'exit' ? 'scale(1.03)' : 'scale(1)',
        pointerEvents: stage === 'exit' ? 'none' : 'all',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient gold gradient glow */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,162,76,0.18) 0%, rgba(61,220,132,0.03) 40%, transparent 70%)',
          filter: 'blur(45px)',
          transform: stage === 'locked_rupee' || stage === 'show_logo' ? 'scale(1.25)' : 'scale(0.85)',
          transition: 'transform 0.7s ease',
          pointerEvents: 'none',
        }}
      />

      {/* Center Animated Stage */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 120,
          marginBottom: 28,
          position: 'relative',
        }}
      >
        {/* Stage 1 & 2: Currency Switcher / Locked Rupee */}
        {(stage === 'cycling' || stage === 'locked_rupee') && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: stage === 'locked_rupee' ? 'count-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(4rem, 10vw, 5.8rem)',
                fontWeight: 800,
                lineHeight: 1,
                color: stage === 'locked_rupee' ? '#ffffff' : 'var(--gold)',
                textShadow:
                  stage === 'locked_rupee'
                    ? '0 0 35px rgba(212,162,76,0.85), 0 0 70px rgba(212,162,76,0.45)'
                    : '0 0 20px rgba(212,162,76,0.3)',
                transition: 'color 0.15s ease, text-shadow 0.2s ease',
                letterSpacing: '-0.03em',
              }}
            >
              {CURRENCIES[currIndex]?.sym || '₹'}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.22em',
                color: stage === 'locked_rupee' ? 'var(--gold)' : 'var(--text-faint)',
                marginTop: 8,
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              {CURRENCIES[currIndex]?.name || 'INR'}
            </div>
          </div>
        )}

        {/* Stage 3 & 4: ExpenseFlow Logo morph + typography expansion */}
        {(stage === 'show_logo' || stage === 'expand_text' || stage === 'exit') && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              animation: 'card-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          >
            {/* Gold Logo Icon Tile */}
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 15,
                background: 'linear-gradient(145deg, var(--gold) 0%, #9a6e28 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow:
                  '0 0 0 1px rgba(212,162,76,0.65), 0 10px 30px rgba(212,162,76,0.45), 0 0 50px rgba(212,162,76,0.25)',
                color: 'var(--gold-ink)',
                flexShrink: 0,
                transform: stage === 'expand_text' ? 'scale(1)' : 'scale(1.06)',
                transition: 'transform 0.35s ease',
              }}
            >
              <LogoIcon size={30} />
            </div>

            {/* Typography expanding outwards */}
            <div
              style={{
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: stage === 'expand_text' || stage === 'exit' ? 340 : 0,
                opacity: stage === 'expand_text' || stage === 'exit' ? 1 : 0,
                transition: 'max-width 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                Expense<span style={{ color: 'var(--gold)' }}>Flow</span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.64rem',
                  letterSpacing: '0.18em',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  marginTop: -2,
                }}
              >
                Stateless Finance System
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar & Status Text */}
      <div
        style={{
          width: 190,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: '100%',
            height: 3,
            background: 'var(--surface2)',
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--gold), #ffffff)',
              boxShadow: '0 0 10px var(--gold)',
              transition: 'width 0.25s ease-out',
            }}
          />
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.08em',
            color: 'var(--text-faint)',
            textTransform: 'uppercase',
          }}
        >
          {progress < 75 ? 'INITIALIZING PROTOCOLS' : progress < 100 ? 'NODE CONVERGENCE' : 'VERIFYING USER'}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
