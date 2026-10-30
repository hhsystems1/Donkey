/* Ride Smart lesson narration: Archie, selected via Higgsfield. */
var LESSON_NARRATION = {
  1: '/course/media/archie-lesson-1.mp3',
  2: '/course/media/archie-lesson-2.mp3',
  3: '/course/media/archie-lesson-3.mp3',
  4: '/course/media/archie-lesson-4.mp3',
  5: '/course/media/archie-lesson-5.mp3',
  6: '/course/media/archie-lesson-6.mp3'
};
var narrationAudio = null;
var narrationLesson = null;
var narrationEpoch = 0;

var narratorLabel = document.createElement('span');
narratorLabel.id = 'narratorStatus';
narratorLabel.className = 'narrator-status';
narratorLabel.setAttribute('role', 'status');
narratorLabel.setAttribute('aria-live', 'polite');
narratorLabel.textContent = 'Lesson narrator: Archie';
document.querySelector('.audio-bar').appendChild(narratorLabel);

function stopNarration() {
  narrationEpoch++;
  var previous = narrationAudio;
  narrationAudio = null;
  narrationLesson = null;
  if (previous) {
    previous.onerror = previous.onended = previous.onplaying = null;
    previous.pause();
    previous.removeAttribute('src');
    previous.load();
  }
  if (speakingBtn) {
    speakingBtn.classList.remove('speaking');
    speakingBtn = null;
  }
  narratorLabel.textContent = 'Lesson narrator: Archie';
}

function playNarration(idx, fallbackText, btn) {
  if (narrationAudio && narrationLesson === String(idx) && !narrationAudio.paused) {
    stopNarration();
    return;
  }
  stopSpeak();
  stopNarration();
  var epoch = narrationEpoch;
  var clip = new Audio(LESSON_NARRATION[idx]);
  narrationAudio = clip;
  narrationLesson = String(idx);
  speakingBtn = btn || null;
  if (speakingBtn) speakingBtn.classList.add('speaking');
  narratorLabel.textContent = 'Loading Archie’s narration…';
  var fellBack = false;
  function isCurrent() {
    return narrationAudio === clip && narrationEpoch === epoch;
  }
  function fallback() {
    if (!isCurrent() || fellBack) return;
    fellBack = true;
    stopNarration();
    speak(fallbackText, btn);
    narratorLabel.textContent = 'Narrator unavailable. Using your device voice.';
  }
  clip.onplaying = function () {
    if (isCurrent()) narratorLabel.textContent = idx === 'guided' ? 'Archie is reading this step. Tap again to stop.' : 'Archie is narrating lesson ' + idx + '. Tap again to stop.';
  };
  clip.onended = function () {
    if (isCurrent()) stopNarration();
  };
  clip.onerror = fallback;
  var playback = clip.play();
  if (playback && playback.catch) playback.catch(fallback);
}
window.addEventListener('pagehide', stopNarration);
