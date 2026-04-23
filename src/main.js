import '@google/model-viewer';

const viewer = document.getElementById('viewer');
const hero = document.getElementById('hero');
const enterButton = document.getElementById('enterButton');
const retryButton = document.getElementById('retryButton');
const loadingMask = document.getElementById('loadingMask');
const errorMask = document.getElementById('errorMask');

const MODEL_DESKTOP = '/model.glb';
const MODEL_MOBILE = '/model.glb';

function getConnectionInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    saveData: Boolean(connection && connection.saveData),
    effectiveType: connection && connection.effectiveType ? connection.effectiveType : '',
  };
}

function shouldPreferManualLoad() {
  const { saveData, effectiveType } = getConnectionInfo();
  const smallScreen = window.innerWidth <= 900;
  const slowNetwork = /2g|3g|slow-2g/.test(effectiveType);
  return saveData || slowNetwork || smallScreen;
}

async function fileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}

async function pickModel() {
  if (window.innerWidth <= 900 && await fileExists(MODEL_MOBILE)) {
    return MODEL_MOBILE;
  }
  return MODEL_DESKTOP;
}

function showLoading() {
  loadingMask.classList.remove('hidden');
  errorMask.classList.add('hidden');
}

function hideLoading() {
  loadingMask.classList.add('hidden');
}

function showError() {
  hideLoading();
  errorMask.classList.remove('hidden');
}

async function loadModel({ dismissPoster = true } = {}) {
  showLoading();
  errorMask.classList.add('hidden');

  const modelUrl = await pickModel();
  viewer.src = modelUrl;

  if (dismissPoster) {
    viewer.dismissPoster();
  }
}

enterButton.addEventListener('click', async () => {
  hero.classList.add('hidden');
  await loadModel();
});

retryButton.addEventListener('click', async () => {
  errorMask.classList.add('hidden');
  await loadModel({ dismissPoster: false });
});

viewer.addEventListener('load', () => {
  hideLoading();
  hero.classList.add('hidden');
});

viewer.addEventListener('error', () => {
  showError();
});

window.addEventListener('DOMContentLoaded', async () => {
  if (!shouldPreferManualLoad()) {
    hero.classList.add('hidden');
    await loadModel();
  }
});
