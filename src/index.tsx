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
    options?.reverb?.amount !== undefined &&
    (options.reverb.amount > 100 || options.reverb.amount < 0)
  ) {
    throw RangeError('Reverb amount must be between 0 and 100.');
  }
  if (
    options?.delay?.amount !== undefined &&
    (options.delay.amount > 100 || options.delay.amount < 0)
  ) {
    throw RangeError('Delay amount must be between 0 and 100.');
  }
  if (
    options?.delay?.timeInMS !== undefined &&
    (options.delay.timeInMS > 2000 || options.delay.timeInMS < 0)
  ) {
    throw RangeError('timeInMS must be between 0 and 2000.');
  }
  if (
    options?.delay?.feedbackAmount !== undefined &&
    (options.delay.feedbackAmount > 100 || options.delay.feedbackAmount < -100)
  ) {
    throw RangeError('feedbackAmount must be between -100 and 100.');
  }
  if (
    options?.delay?.lowPassCutoff !== undefined &&
    options.delay.lowPassCutoff < 10
  ) {
    throw RangeError('lowPassCutoff must be larger than 10.');
  }
  if (
    options?.distortion?.amount !== undefined &&
    (options.distortion.amount > 100 || options.distortion.amount < 0)
  ) {
    throw RangeError('Distortion amount must be between -100 and 100.');
  }
  if (
    options?.distortion?.gain !== undefined &&
    (options.distortion.gain > 20 || options.distortion.gain < -80)
  ) {
    throw RangeError('distortionGain must be between -80 and 20.');
  }
  if (
    options?.pitch?.amount !== undefined &&
    (options.pitch.amount > 2400 || options.pitch.amount < -2400)
  ) {
    throw RangeError('Pitch amount must be between -2400 and 2400.');
  }
  if (
    options?.pitch?.overlapAmount !== undefined &&
    (options.pitch.overlapAmount > 32 || options?.pitch.overlapAmount < 3)
  ) {
    throw RangeError('overlapAmount must be between 3 and 32.');
  }
  if (
    options?.pitch?.pitchRate !== undefined &&
    (options.pitch.pitchRate > 32 || options.pitch.pitchRate < 1 / 32)
  ) {
    throw RangeError('pitchRate must be between 1/32 and 32.');
  }
  if (
    options?.playRate?.amount !== undefined &&
    (options.playRate.amount > 4 || options.playRate.amount < 0.25)
  ) {
    throw RangeError('Play rate amount must be between 0.25 and 4.');
  }
  return AudioProcessor.processFile(filePath, outputFileName, {
    reverb: options?.reverb?.amount,
    delay: options?.delay?.amount,
    delayTimeInMS: options?.delay?.timeInMS,
    delayFeedback: options?.delay?.feedbackAmount,
    delayLowPassCutoff: options?.delay?.lowPassCutoff,
    distortionAmount: options?.distortion?.amount,
    distortionGain: options?.distortion?.gain,
    pitchAmount: options?.pitch?.amount,
    pitchOverlap: options?.pitch?.overlapAmount,
    pitchRate: options?.pitch?.pitchRate,
    playRate: options?.playRate?.amount,
  });
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
