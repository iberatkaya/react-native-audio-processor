import * as React from 'react';
import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';

import { View, Text, ActivityIndicator } from 'react-native';
import AudioProcessor, { useSongIsPlaying } from 'react-native-audio-processor';
import DocumentPicker from 'react-native-document-picker';
import Button from './components/Button';
import styles from './styles';
import IconButton from './components/IconButton';

export default function App() {
  const [file, setFile] = useState<null | {
    filePath: string;
    fileName: string;
  }>(null);
  const [processedFile, setProcessedFile] = useState<null | string>(null);
  const [playedPlayerOnce, setPlayedPlayerOnce] = useState(false);
  const [playbackTime, setPlaybackTime] = useState<null | number>(null);
  const [fileDuration, setFileDuration] = useState<null | number>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playRate, setPlayRate] = useState(1);
  const isPlaying = useSongIsPlaying();
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const getExtensionFromFileName = (fileName: string) =>
    fileName.split('.').pop();

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        AudioProcessor.isPlaying().then((i) => {
          if (i) {
            AudioProcessor.getPlaybackTime().then((j) => {
              setPlaybackTime(j);
            });
          }
        });
      }, 200);
    } else {
      setTimeout(() => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }, 500);
    }
  }, [isPlaying]);

  const getFileDuration = async () => {
    const duration = await AudioProcessor.getDuration();
    setFileDuration(duration ?? 0);
  };

  const formatDuration = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds);
    var timeString = date.toISOString().substring(14, 19);
    return timeString;
  };

  return (
    <View style={styles.container}>
      {isProcessing ? (
        <ActivityIndicator size="large" color="#ffa100" />
      ) : (
        <>
          {!!file && (
            <>
              <Text style={styles.fileNameText}>{file.fileName}</Text>
              <Text style={styles.playbackText}>
                {formatDuration(playbackTime ?? 0)}/
                {formatDuration(fileDuration ?? 0)}
              </Text>
              <Text style={styles.playRateText}>
                Play Rate: {playRate.toFixed(2)}x
              </Text>
              <View style={styles.sliderRow}>
                <Text style={styles.minimumText}>0.25x</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0.25}
                  maximumValue={4}
                  minimumTrackTintColor="#55f"
                  maximumTrackTintColor="#999"
                  value={playRate}
                  step={0.05}
                  onValueChange={setPlayRate}
                />
                <Text style={styles.maximumText}>4x</Text>
              </View>
              <Button
                onPress={async () => {
                  setIsProcessing(true);
                  const outputFilePath = await AudioProcessor.processFile(
                    file.filePath,
                    'output.' + getExtensionFromFileName(file.fileName),
                    {
                      playRate: playRate,
                    }
                  );
                  setProcessedFile(outputFilePath);
                  setIsProcessing(false);
                }}
                containerStyle={styles.processButton}
                title="Process source file"
              />
              <View style={styles.buttonsContainer}>
                {!isPlaying ? (
                  <>
                    {playedPlayerOnce && (
                      <Button
                        onPress={async () => {
                          await AudioProcessor.play();
                          getFileDuration();
                        }}
                        containerStyle={styles.continueButton}
                        title="Continue playing"
                      />
                    )}
                    <Button
                      onPress={async () => {
                        await AudioProcessor.playFile(file.filePath);
                        getFileDuration();
                        if (!playedPlayerOnce) setPlayedPlayerOnce(true);
                      }}
                      containerStyle={styles.playSourceButton}
                      title="Play source file"
                    />
                    {!!processedFile && (
                      <Button
                        onPress={async () => {
                          await AudioProcessor.playFile(processedFile);
                          getFileDuration();
                          if (!playedPlayerOnce) setPlayedPlayerOnce(true);
                        }}
                        containerStyle={styles.playProcessedButton}
                        title="Play processed file"
                      />
                    )}
                  </>
                ) : (
                  <View style={styles.playbackContainer}>
                    <IconButton
                      name="arrow-back-ios"
                      containerStyle={styles.backIcon}
                      onPress={() => {
                        if (playbackTime !== null) {
                          const newVal = playbackTime - 10;
                          AudioProcessor.setPlaybackTime(
                            newVal > 0 ? newVal : 0
                          );
                        }
                      }}
                    />
                    <Button
                      onPress={() => AudioProcessor.pausePlayer()}
                      containerStyle={styles.pauseButton}
                      title="Pause playing"
                    />
                    <IconButton
                      name="arrow-forward-ios"
                      containerStyle={styles.forwardIcon}
                      onPress={() => {
                        if (playbackTime !== null) {
                          const newVal = playbackTime + 10;
                          if (fileDuration !== null) {
                            AudioProcessor.setPlaybackTime(
                              newVal < fileDuration ? newVal : fileDuration
                            );
                          } else {
                            // If `fileDuration` is `null`, still attempt to go forward
                            try {
                              AudioProcessor.setPlaybackTime(newVal);
                            } catch (e) {
                              console.log(e);
                            }
                          }
                        }
                      }}
                    />
                  </View>
                )}
              </View>
            </>
          )}
          <Button
            onPress={async () => {
              const myFile = await DocumentPicker.pickSingle({
                presentationStyle: 'pageSheet',
                type: DocumentPicker.types.audio,
                copyTo: 'cachesDirectory',
              });
              if (!!myFile.fileCopyUri && !!myFile.name) {
                setFile({
                  fileName: myFile.name,
                  filePath: myFile.fileCopyUri,
                });
              }
            }}
            title="Select an audio file"
            containerStyle={styles.audioPickerButton}
          />
        </>
      )}
    </View>
  );
}
