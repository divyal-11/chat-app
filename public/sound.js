let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

window.addEventListener('click', initAudio, { once: true });
window.addEventListener('keydown', initAudio, { once: true });

// Premium soft glass chime
function playNotificationSound() {
    try {
        initAudio();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;

        // Low-pass filter for a warm, velvety acoustic tone
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);
        filter.connect(audioCtx.destination);

        // First gentle drop (G5 - 784 Hz)
        const osc1 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(783.99, now);
        gain1.gain.setValueAtTime(0.22, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
        osc1.connect(gain1);
        gain1.connect(filter);
        osc1.start(now);
        osc1.stop(now + 0.32);

        // Second resonant harmonic (C6 - 1046.5 Hz)
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1046.50, now + 0.07);
        gain2.gain.setValueAtTime(0.18, now + 0.07);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(filter);
        osc2.start(now + 0.07);
        osc2.stop(now + 0.45);
    } catch (e) {
        console.warn("Audio warning:", e);
    }
}
