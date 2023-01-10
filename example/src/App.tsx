import * as React from 'react';
import { useEffect, useState } from 'react';
import PagerView from 'react-native-pager-view';

import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AudioProcessor, { useSongIsPlaying } from 'react-native-audio-processor';
import DocumentPicker from 'react-native-document-picker';
import Button from './components/Button';
import styles from './styles';
import IconButton from './components/IconButton';
import AudioEffect from './components/AudioEffect';

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
  const [reverbAmount, setReverbAmount] = useState(0);
  const [delayAmount, setDelayAmount] = useState(0);
  const [delayTimeInMS, setDelayTimeInMS] = useState(1000);
  const [delayFeedbackAmount, setDelayFeedbackAmount] = useState(50);
  const [delayLowPassCutoff, setDelayLowPassCutoff] = useState(15000);
  const [distortionAmount, setDistortionAmount] = useState(0);
  const [distortionGain, setDistortionGain] = useState(-6);
  const [pitchAmount, setPitchAmount] = useState(0);
  const [pitchOverlapAmount, setPitchOverlapAmount] = useState(8);
  const [pitchRate, setPitchRate] = useState(1);
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

  const resetAllEffects = () => {
    setReverbAmount(0);
    setDelayAmount(0);
    setDelayTimeInMS(1000);
    setDelayFeedbackAmount(50);
    setDelayLowPassCutoff(15000);
    setDistortionAmount(0);
    setDistortionGain(-6);
    setPitchAmount(0);
    setPitchOverlapAmount(8);
    setPitchRate(1);
    setPlayRate(1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
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

                <PagerView style={styles.pageView} initialPage={0}>
                  <View key="0" style={styles.settingContainer}>
                    <ScrollView
                      contentContainerStyle={styles.settingScrollView}
                    >
                      <View style={{ flex: 1 }} />
                      <AudioEffect
                        title={`Play Rate: ${playRate.toFixed(2)}x`}
                        minLabel="0.25x"
                        maxLabel="4x"
                        minimumValue={0.25}
                        maximumValue={4}
                        value={playRate}
                        step={0.05}
                        onValueChange={setPlayRate}
                      />
                      <View style={{ flex: 1 }} />
                    </ScrollView>
                  </View>
                  <View key="1" style={styles.settingContainer}>
                    <ScrollView
                      contentContainerStyle={styles.settingScrollView}
                    >
                      <AudioEffect
                        title={`Reverb amount: ${reverbAmount}%`}
                        minLabel="0%"
                        maxLabel="100%"
                        minimumValue={0}
                        maximumValue={100}
                        onValueChange={setReverbAmount}
                        step={1}
                        value={reverbAmount}
                      />
                    </ScrollView>
                  </View>
                  <View key="2" style={styles.settingContainer}>
                    <ScrollView
                      contentContainerStyle={styles.settingScrollView}
                    >
                      <AudioEffect
                        title={`Delay amount: ${delayAmount}%`}
                        minLabel="0%"
                        maxLabel="100%"
                        minimumValue={0}
                        maximumValue={100}
                        onValueChange={setDelayAmount}
                        step={1}
                        value={delayAmount}
                      />
                      <AudioEffect
                        title={`Delay time: ${delayTimeInMS} ms`}
                        minLabel="0ms"
                        maxLabel="2000ms"
                        minimumValue={0}
                        maximumValue={2000}
                        onValueChange={setDelayTimeInMS}
                        step={1}
                        value={delayTimeInMS}
                      />
                      <AudioEffect
                        title={`Delay feedback: ${delayFeedbackAmount}%`}
                        minLabel="-100%"
                        maxLabel="100%"
                        minimumValue={-100}
                        maximumValue={100}
                        onValueChange={setDelayFeedbackAmount}
                        step={1}
                        value={delayFeedbackAmount}
                      />
                      <AudioEffect
                        title={`Delay low pass cutoff: ${delayLowPassCutoff} Hz`}
                        minLabel="10%"
                        maxLabel="SR/2"
                        minimumValue={10}
                        maximumValue={41000 / 2}
                        onValueChange={setDelayLowPassCutoff}
                        step={1}
                        value={delayLowPassCutoff}
                      />
                    </ScrollView>
                  </View>
                  <View key="3" style={styles.settingContainer}>
                    <ScrollView
                      contentContainerStyle={styles.settingScrollView}
                    >
                      <AudioEffect
                        title={`Distortion amount: ${distortionAmount}%`}
                        minLabel="0%"
                        maxLabel="100%"
                        minimumValue={0}
                        maximumValue={100}
                        onValueChange={setDistortionAmount}
                        step={1}
                        value={distortionAmount}
                      />
                      <AudioEffect
                        title={`Distortion gain: ${distortionGain} dB`}
                        minLabel="-80 dB"
                        maxLabel="20 dB"
                        minimumValue={-80}
                        maximumValue={20}
                        onValueChange={setDistortionGain}
                        step={1}
                        value={distortionGain}
                      />
                    </ScrollView>
                  </View>
                  <View key="4" style={styles.settingContainer}>
                    <ScrollView
                      contentContainerStyle={styles.settingScrollView}
                    >
                      <AudioEffect
                        title={`Pitch amount: ${pitchAmount} cent`}
                        minLabel="-2400 cent"
                        maxLabel="2400 cent"
                        minimumValue={-2400}
                        maximumValue={2400}
                        onValueChange={setPitchAmount}
                        step={50}
                        value={pitchAmount}
                      />
                      <AudioEffect
                        title={`Pitch overlap: ${pitchOverlapAmount.toFixed(
                          2
                        )}`}
                        minLabel="3"
                        maxLabel="32"
                        minimumValue={3}
                        maximumValue={32}
                        onValueChange={setPitchOverlapAmount}
                        step={0.1}
                        value={pitchOverlapAmount}
                      />
                      <AudioEffect
                        title={`Pitch overlap: ${pitchOverlapAmount.toFixed(
                          2
                        )}`}
                        minLabel="3"
                        maxLabel="32"
                        minimumValue={3}
                        maximumValue={32}
                        onValueChange={setPitchOverlapAmount}
                        step={0.1}
                        value={pitchOverlapAmount}
                      />
                      <AudioEffect
                        title={`Pitch rate: ${pitchRate.toFixed(2)}`}
                        minLabel="1"
                        maxLabel="32"
                        minimumValue={1}
                        maximumValue={32}
                        onValueChange={setPitchRate}
                        step={0.05}
                        value={pitchRate}
                      />
                    </ScrollView>
                  </View>
                </PagerView>
                <Button
                  containerStyle={styles.resetButton}
                  title="Reset Effects"
                  onPress={resetAllEffects}
                />
                <Button
                  onPress={async () => {
                    setIsProcessing(true);
                    const options = {
                      playRate: {
                        amount: playRate,
                      },
                      delay: {
                        amount: delayAmount,
                        feedbackAmount: delayFeedbackAmount,
                        lowPassCutoff: delayLowPassCutoff,
                        timeInMS: delayTimeInMS,
                      },
                      distortion: {
                        amount: distortionAmount,
                        gain: distortionGain,
                      },
                      pitch: {
                        amount: pitchAmount,
                        overlapAmount: pitchOverlapAmount,
                        pitchRate: pitchRate,
                      },
                      reverb: {
                        amount: reverbAmount,
                      },
                    };
                    console.log('options', options);
                    const outputFilePath = await AudioProcessor.processFile(
                      file.filePath,
                      'output.' + getExtensionFromFileName(file.fileName),
                      options
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
      </ScrollView>
    </SafeAreaView>
  );
}
