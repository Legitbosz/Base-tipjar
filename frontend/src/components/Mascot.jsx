import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');

  .mascot-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Fredoka One', cursive;
    position: relative;
    user-select: none;
  }

  .mascot-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: mascotBounce 0.6s ease-in-out infinite alternate;
  }
  .mascot-wrapper.speed-1 { animation-duration: 0.45s; }
  .mascot-wrapper.speed-2 { animation-duration: 0.28s; }
  .mascot-wrapper.speed-3 { animation-duration: 0.15s; }
  .mascot-wrapper.hype {
    animation-name: mascotHype;
    animation-duration: 0.12s !important;
  }

  @keyframes mascotBounce {
    from { transform: translateY(0px) rotate(-2deg); }
    to   { transform: translateY(-18px) rotate(2deg); }
  }
  @keyframes mascotHype {
    from { transform: translateY(0px) rotate(-5deg) scale(1.05); }
    to   { transform: translateY(-22px) rotate(5deg) scale(1.08); }
  }

  /* HAT */
  .hat { position: relative; z-index: 30; margin-bottom: -18px; animation: hatWiggle 1.2s ease-in-out infinite alternate; }
  @keyframes hatWiggle {
    from { transform: rotate(-8deg) translateX(-4px); }
    to   { transform: rotate(8deg) translateX(4px); }
  }
  .hat-brim { width: 140px; height: 22px; background: #FFD700; border-radius: 50%; box-shadow: 0 4px 0 #c9a800; position: relative; z-index: 2; }
  .hat-top { width: 90px; height: 80px; background: #FFD700; border-radius: 14px 14px 0 0; margin: 0 auto; margin-bottom: -4px; position: relative; }
  .hat-band { position: absolute; bottom: 12px; left: 0; right: 0; height: 14px; background: #2563FF; }
  .hat-star { position: absolute; top: 16px; left: 50%; transform: translateX(-50%); font-size: 22px; animation: starSpin 2s linear infinite; }
  @keyframes starSpin {
    from { transform: translateX(-50%) rotate(0deg); }
    to   { transform: translateX(-50%) rotate(360deg); }
  }

  /* ARMS */
  .body-group { display: flex; align-items: center; position: relative; z-index: 20; }
  .arm { width: 32px; height: 80px; background: #2563FF; border-radius: 20px; position: relative; z-index: 1; }
  .arm::after { content: ''; width: 28px; height: 28px; background: white; border: 3px solid #2563FF; border-radius: 50%; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); }
  .arm-left { margin-right: -10px; border-radius: 20px 10px 20px 20px; transform-origin: top right; animation: armLeft 0.6s ease-in-out infinite alternate; }
  .arm-right { margin-left: -10px; border-radius: 10px 20px 20px 20px; transform-origin: top left; animation: armRight 0.6s ease-in-out infinite alternate; }
  .mascot-wrapper.speed-1 .arm-left, .mascot-wrapper.speed-1 .arm-right { animation-duration: 0.45s; }
  .mascot-wrapper.speed-2 .arm-left, .mascot-wrapper.speed-2 .arm-right { animation-duration: 0.28s; }
  .mascot-wrapper.speed-3 .arm-left, .mascot-wrapper.speed-3 .arm-right { animation-duration: 0.15s; }
  .mascot-wrapper.hype .arm-left, .mascot-wrapper.hype .arm-right { animation-duration: 0.1s; }
  @keyframes armLeft { from { transform: rotate(-50deg); } to { transform: rotate(20deg); } }
  @keyframes armRight { from { transform: rotate(50deg); } to { transform: rotate(-20deg); } }

  /* BLOB */
  .blob-body { width: 160px; height: 155px; background: #2563FF; border-radius: 50% 50% 45% 45% / 55% 55% 45% 45%; position: relative; z-index: 20; box-shadow: 0 8px 0 #1a4fd8, 0 0 40px #2563FF66; }
  .mascot-wrapper.hype .blob-body { box-shadow: 0 8px 0 #1a4fd8, 0 0 60px #FFD70099; }
  .eyes { display: flex; gap: 18px; justify-content: center; padding-top: 38px; }
  .eye { width: 42px; height: 42px; background: white; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; animation: eyeBlink 3s ease-in-out infinite; }
  @keyframes eyeBlink { 0%,90%,100% { transform: scaleY(1); } 95% { transform: scaleY(0.05); } }
  .pupil { width: 20px; height: 20px; background: #1a1a2e; border-radius: 50%; animation: pupilMove 2s ease-in-out infinite alternate; }
  @keyframes pupilMove {
    0% { transform: translate(-4px,-4px); } 25% { transform: translate(4px,-4px); }
    50% { transform: translate(4px,4px); }  75% { transform: translate(-4px,4px); }
    100% { transform: translate(0,0); }
  }
  .eye-shine { position: absolute; width: 10px; height: 10px; background: white; border-radius: 50%; top: 6px; right: 8px; opacity: 0.8; }
  .mouth { position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); width: 60px; height: 28px; border-bottom: 6px solid white; border-radius: 0 0 50px 50px; animation: mouthBop 0.6s ease-in-out infinite alternate; }
  @keyframes mouthBop { from { transform: translateX(-50%) scaleX(0.8); } to { transform: translateX(-50%) scaleX(1.1); } }
  .cheeks { display: flex; justify-content: space-between; padding: 0 12px; position: absolute; bottom: 46px; left: 0; right: 0; }
  .cheek { width: 26px; height: 14px; background: #FF6B9D; border-radius: 50%; opacity: 0.6; }

  /* LEGS */
  .legs { display: flex; gap: 20px; margin-top: -8px; z-index: 15; }
  .leg { width: 34px; height: 60px; background: #2563FF; border-radius: 10px; position: relative; box-shadow: 2px 4px 0 #1a4fd8; }
  .leg::after { content: ''; width: 48px; height: 22px; background: #1a1a2e; border-radius: 50% 50% 40% 40%; position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); box-shadow: 0 4px 0 #000; }
  .leg-left { transform-origin: top center; animation: legLeft 0.6s ease-in-out infinite alternate; }
  .leg-right { transform-origin: top center; animation: legRight 0.6s ease-in-out infinite alternate; }
  .mascot-wrapper.speed-1 .leg-left, .mascot-wrapper.speed-1 .leg-right { animation-duration: 0.45s; }
  .mascot-wrapper.speed-2 .leg-left, .mascot-wrapper.speed-2 .leg-right { animation-duration: 0.28s; }
  .mascot-wrapper.speed-3 .leg-left, .mascot-wrapper.speed-3 .leg-right { animation-duration: 0.15s; }
  .mascot-wrapper.hype .leg-left, .mascot-wrapper.hype .leg-right { animation-duration: 0.1s; }
  @keyframes legLeft { from { transform: rotate(-15deg); } to { transform: rotate(10deg); } }
  @keyframes legRight { from { transform: rotate(15deg); } to { transform: rotate(-10deg); } }

  /* SHADOW */
  .mascot-shadow { width: 120px; height: 20px; background: #00000044; border-radius: 50%; margin-top: 18px; animation: shadowPulse 0.6s ease-in-out infinite alternate; filter: blur(6px); }
  @keyframes shadowPulse { from { transform: scaleX(0.8); opacity: 0.3; } to { transform: scaleX(1.1); opacity: 0.6; } }

  /* SPEECH BUBBLE */
  .speech-bubble {
    position: absolute; top: -72px; right: 10px;
    background: white; color: #1a1a2e;
    font-family: 'Fredoka One', cursive;
    font-size: 13px; padding: 8px 14px;
    border-radius: 16px; width: 150px;
    text-align: center; line-height: 1.4;
    box-shadow: 0 4px 20px #0004;
    animation: bubblePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
    z-index: 50; pointer-events: none;
    transition: background 0.3s;
  }
  .speech-bubble.hype-bubble {
    background: #FFD700;
    color: #1a1a2e;
    font-size: 14px;
    box-shadow: 0 4px 30px #FFD70088;
  }
  .speech-bubble::before { content: ''; position: absolute; bottom: -12px; right: 24px; border: 7px solid transparent; border-top-color: white; }
  .speech-bubble.hype-bubble::before { border-top-color: #FFD700; }
  @keyframes bubblePop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }

  /* MUSIC NOTES */
  .note { position: absolute; font-size: 20px; animation: noteFloat 2s ease-in-out infinite; opacity: 0; pointer-events: none; }
  @keyframes noteFloat { 0% { transform: translateY(0) rotate(-10deg); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(-60px) rotate(10deg); opacity: 0; } }

  /* COIN BURST */
  .coin-burst { position: fixed; pointer-events: none; z-index: 9999; font-size: 28px; animation: coinFly 1.4s ease-out forwards; }
  @keyframes coinFly { 0% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; } 100% { transform: translateY(-260px) scale(0.2) rotate(720deg); opacity: 0; } }
`;

const IDLE_MESSAGE = "💙 Tip me and watch me go!";
const HYPE_MESSAGE = "🔵 You are a based chad!";
const COINS = ["💰", "🪙", "💛", "⭐", "🎉", "🔵", "💎"];

function getSpeedClass(count) {
  if (count >= 20) return "speed-3";
  if (count >= 8)  return "speed-2";
  if (count >= 3)  return "speed-1";
  return "";
}

export default function Mascot({ tipCount = 0, txStatus }) {
  const [isHype, setIsHype] = useState(false);
  const [bubbleKey, setBubbleKey] = useState(0);
  const [coins, setCoins] = useState([]);

  // Fire hype mode whenever a tip succeeds
  useEffect(() => {
    if (txStatus === "success") {
      setIsHype(true);
      setBubbleKey((k) => k + 1);
      spawnCoins();
      // Return to normal after 4 seconds
      const t = setTimeout(() => setIsHype(false), 4000);
      return () => clearTimeout(t);
    }
    // When txStatus resets to null, stop hype immediately
    if (txStatus === null) {
      setIsHype(false);
    }
  }, [txStatus]);

  const spawnCoins = () => {
    // Burst from centre-top of viewport
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.35;
    const batch = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      emoji: COINS[Math.floor(Math.random() * COINS.length)],
      x: cx + (Math.random() - 0.5) * 200,
      y: cy,
      dur: 0.9 + Math.random() * 0.6,
    }));
    setCoins((prev) => [...prev, ...batch]);
    setTimeout(
      () => setCoins((prev) => prev.filter((c) => !batch.find((b) => b.id === c.id))),
      2000
    );
  };

  const speedClass = isHype ? "hype" : getSpeedClass(tipCount);

  return (
    <>
      <style>{styles}</style>

      {coins.map((c) => (
        <div
          key={c.id}
          className="coin-burst"
          style={{ left: c.x, top: c.y, animationDuration: c.dur + "s" }}
        >
          {c.emoji}
        </div>
      ))}

      <div className="mascot-root">
        <div className={`mascot-wrapper ${speedClass}`}>

          {/* Speech bubble */}
          <div className={`speech-bubble ${isHype ? "hype-bubble" : ""}`} key={bubbleKey}>
            {isHype ? HYPE_MESSAGE : IDLE_MESSAGE}
          </div>

          {/* Music notes */}
          <span className="note" style={{ left: -40, top: 30, animationDelay: "0s" }}>🎵</span>
          <span className="note" style={{ right: -40, top: 60, animationDelay: "0.7s" }}>🎶</span>
          <span className="note" style={{ left: -20, top: 100, animationDelay: "1.3s" }}>🎵</span>

          {/* Hat */}
          <div className="hat">
            <div className="hat-top">
              <div className="hat-band" />
              <div className="hat-star">⭐</div>
            </div>
            <div className="hat-brim" />
          </div>

          {/* Body */}
          <div className="body-group">
            <div className="arm arm-left" />
            <div className="blob-body">
              <div className="eyes">
                <div className="eye"><div className="pupil" /><div className="eye-shine" /></div>
                <div className="eye"><div className="pupil" /><div className="eye-shine" /></div>
              </div>
              <div className="cheeks">
                <div className="cheek" /><div className="cheek" />
              </div>
              <div className="mouth" />
            </div>
            <div className="arm arm-right" />
          </div>

          {/* Legs */}
          <div className="legs">
            <div className="leg leg-left" />
            <div className="leg leg-right" />
          </div>
        </div>

        <div className="mascot-shadow" />
      </div>
    </>
  );
}
