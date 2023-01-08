import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
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

const eventEmitter = new NativeEventEmitter(AudioProcessor);

/**
 * Checks if the song is currently playing.
 * The value is initially `null` until the hook can
 * determine if the player is playing.
 */
export function useSongIsPlaying(): boolean | null {
  const [songIsPlaying, setSongIsPlaying] = useState<boolean | null>(null);

  useEffect(() => {
    const onChange = (val: boolean) => {
      setSongIsPlaying(val);
    };

    const subscription = eventEmitter.addListener('SONG_IS_PLAYING', onChange);

    return () => subscription.remove();
  }, []);

  return songIsPlaying;
}

/** Listener to check if the song is playing. */
export function addSongIsPlayingListener(
  callback: (isPlaying: boolean) => void
) {
  return eventEmitter.addListener('SONG_IS_PLAYING', callback);
}

/** Play an audio file at `path`. */
export function playFile(path: string): Promise<void> {
  return AudioProcessor.playFile(path);
}

/**
 * Starts playing with the current player.
 * For it to play, it must already be initialized with `playFile`.
 */
export function play(): Promise<boolean> {
  return AudioProcessor.play();
}

/** Stop the player. */
export function stopPlayer(): Promise<boolean> {
  return AudioProcessor.stopPlayer();
}

/** Get the current playback time of the player. */
export function getPlaybackTime(): Promise<number | null> {
  return AudioProcessor.getPlaybackTime();
}

/**
 * Set the playback time of the audio player.
 * The `time` must be greater than 0 and less than the total song
 * duration.
 */
export function setPlaybackTime(time: number): Promise<boolean> {
  return AudioProcessor.setPlaybackTime(time);
}

/** Checks if the song is playing. */
export function isPlaying(): Promise<boolean> {
  return AudioProcessor.isPlaying();
}

/** Gets the song duration. */
export function getDuration(): Promise<number | null> {
  return AudioProcessor.getDuration();
}

/** Gets the song file's sample rate. */
export function getFileSampleRate(path: string): Promise<number> {
  return AudioProcessor.getFileSampleRate(path);
}

/** Pauses current player. */
export function pausePlayer(): Promise<boolean> {
  return AudioProcessor.pausePlayer();
}

/**
 * Applies audio effects to the file given in `filePath` and craetes a file named `outPutFileName`.
 * The file is stored in the device cache.
 */
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
  setPlaybackTime,
  addSongIsPlayingListener,
  useSongIsPlaying,
};
