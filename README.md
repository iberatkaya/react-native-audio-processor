# react-native-audio-processor

React Native package for applying audio processing to audio files. It uses [AVAudioEngine](https://developer.apple.com/documentation/avfaudio/audio_engine) to apply audio effects. Currently WIP and iOS only.

## Usage

```ts
import AudioProcessor from 'react-native-audio-processor';

const outputFilePath = await AudioProcessor.processFile(myFile, 'output.m4a' {
    playRate: 1.25,
});

await AudioProcessor.playFile(outputFilePath);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT