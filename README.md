# react-native-audio-processor

React Native package for applying audio processing to audio files. It uses [AVAudioEngine](https://developer.apple.com/documentation/avfaudio/audio_engine) to apply audio effects. Currently WIP and iOS only.

## Features
* Apply play rate, reverb, delay, pitch, and distortion audio effects to sound files
* Play and pause sound files
* Get and set playback time

## Usage

```ts
import AudioProcessor from 'react-native-audio-processor';

const outputFilePath = await AudioProcessor.processFile(myFile, 'output.m4a' {
    playRate: {
      amount: 1.25, // 1.25x play rate speed
    },
    reverb: {
      amount: 40, // 40% reverb applied
    },
    delay: {
      amount: 20, // 20% delay applied
      feedbackAmount: 50,
      lowPassCutoff: 15000,
      timeInMS: 100,
    },
    distortion: {
      amount: 0, // 0% distortion applied
      gain: -6,
    },
    pitch: {
      amount: 0, // No pitch changes applied
      overlapAmount: 8,
      pitchRate: 1,
    },
});


await AudioProcessor.playFile(outputFilePath);
```

## License

MIT
