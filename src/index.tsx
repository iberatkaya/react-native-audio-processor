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
