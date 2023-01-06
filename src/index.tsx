import { NativeModules, Platform } from 'react-native';
import type { ProcessFileOptions } from './types';

const LINKING_ERROR =
  `The package 'react-native-audio-processor' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AudioProcessor = NativeModules.AudioProcessor
  ? NativeModules.AudioProcessor
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function playFile(path: string): Promise<void> {
  return AudioProcessor.playFile(path);
}

export function play(): Promise<boolean> {
  return AudioProcessor.play();
}

export function stopPlayer(): Promise<boolean> {
  return AudioProcessor.stopPlayer();
}

export function getPlaybackTime(): Promise<number | null> {
  return AudioProcessor.getPlaybackTime();
}

export function isPlaying(): Promise<boolean> {
  return AudioProcessor.isPlaying();
}

export function getDuration(): Promise<number | null> {
  return AudioProcessor.getDuration();
}

export function getFileSampleRate(path: string): Promise<number> {
  return AudioProcessor.getFileSampleRate(path);
}

export function pausePlayer(): Promise<boolean> {
  return AudioProcessor.pausePlayer();
}

export function processFile(
  filePath: string,
  outputFileName: string,
  options?: ProcessFileOptions
): Promise<string> {
  if (
    options?.reverb !== undefined &&
    (options.reverb > 100 || options.reverb < 0)
  ) {
    throw RangeError('reverb must be between 0 and 100.');
  }
  if (
    options?.delay !== undefined &&
    (options.delay > 100 || options.delay < 0)
  ) {
    throw RangeError('delay must be between 0 and 100.');
  }
  if (
    options?.delayTimeInMS !== undefined &&
    (options.delayTimeInMS > 2000 || options.delayTimeInMS < 0)
  ) {
    throw RangeError('delayTimeInMS must be between 0 and 2000.');
  }
  if (
    options?.delayFeedback !== undefined &&
    (options.delayFeedback > 100 || options.delayFeedback < -100)
  ) {
    throw RangeError('delayFeedback must be between -100 and 100.');
  }
  if (
    options?.delayLowPassCutoff !== undefined &&
    options.delayLowPassCutoff < 10
  ) {
    throw RangeError('delayLowPassCutoff must be larger than 10.');
  }
  if (
    options?.distortionAmount !== undefined &&
    (options.distortionAmount > 100 || options.distortionAmount < 0)
  ) {
    throw RangeError('distortionAmount must be between -100 and 100.');
  }
  if (
    options?.distortionGain !== undefined &&
    (options.distortionGain > 20 || options.distortionGain < -80)
  ) {
    throw RangeError('distortionGain must be between -80 and 20.');
  }
  if (
    options?.pitchAmount !== undefined &&
    (options.pitchAmount > 2400 || options.pitchAmount < -2400)
  ) {
    throw RangeError('pitchAmount must be between -2400 and 2400.');
  }
  if (
    options?.pitchOverlap !== undefined &&
    (options.pitchOverlap > 32 || options.pitchOverlap < 3)
  ) {
    throw RangeError('pitchOverlap must be between 3 and 32.');
  }
  if (
    options?.pitchRate !== undefined &&
    (options.pitchRate > 32 || options.pitchRate < 1 / 32)
  ) {
    throw RangeError('pitchOverlap must be between 1/32 and 32.');
  }
  if (
    options?.playRate !== undefined &&
    (options.playRate > 4 || options.playRate < 0.25)
  ) {
    throw RangeError('playRate must be between 0.25 and 4.');
  }
  return AudioProcessor.processFile(filePath, outputFileName, options);
}

export default {
  playFile,
  stopPlayer,
  processFile,
  isPlaying,
  getPlaybackTime,
  getFileSampleRate,
  getDuration,
  pausePlayer,
  play,
};
