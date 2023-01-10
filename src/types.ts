export interface ProcessFileOptions {
  /** Reverb related options. */
  reverb?: {
    /**
     * You specify the blend as a percentage.
     * The range is 0% through 100%, where 0% represents all dry.
     */
    amount?: number;
  };

  /** Delay related options. */
  delay?: {
    /**
     * You specify the blend as a percentage.
     * The default value is 100%.
     * The valid range of values is 0% through 100%, where 0% represents all dry.
     */
    amount?: number;

    /**
     * You specify the delay in seconds. The default value is 1000. The valid range of values is 0 to 2000 ms.
     */
    timeInMS?: number;

    /**
     * The amount of the output signal that feeds back into the delay line.
     * You specify the feedback as a percentage. The default value is 50%.
     * The valid range of values is -100% to 100%.
     */
    feedbackAmount?: number;

    /**
     * The cutoff frequency above which high frequency content rolls off, in hertz.
     * The default value is 15000 Hz. The valid range of values is 10 Hz through (sampleRate/2).
     */
    lowPassCutoff?: number;
  };

  /** Distortion related options. */
  distortion?: {
    /**
     * You specify the blend as a percentage. The default value is 0%.
     * The valid range is 0% through 100%, where 0 represents all dry.
     */
    amount?: number;

    /**
     * The gain that the audio unit applies to the signal before distortion, in decibels.
     * The default value is -6 dB. The valid range of values is -80 dB to 20 dB.
     */
    gain?: number;
  };

  /** Pitch related options. */
  pitch?: {
    /**
     * The audio unit measures the pitch in cents, a logarithmic value you use for measuring musical intervals.
     * One octave is equal to 1200 cents. One musical semitone is equal to 100 cents.
     * The default value is 0.0. The range of values is -2400 to 2400.
     */
    amount?: number;

    /**
     * A higher value results in fewer artifacts in the output signal.
     * The default value is 8.0. The range of values is 3.0 to 32.0.
     */
    overlapAmount?: number;

    /**
     * The default value is 1.0. The range of supported values is 1/32 to 32.0.
     */
    pitchRate?: number;
  };

  /** Play rate related options. */
  playRate?: {
    /**
     * The audio playback rate. The default value is 1.0. The range of values is 0.25 to 4.0.
     */
    amount?: number;
  };
}
