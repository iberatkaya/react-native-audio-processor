import * as React from 'react';
import { useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';

import {
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator,
} from 'react-native';
import AudioProcessor from 'react-native-audio-processor';
import DocumentPicker from 'react-native-document-picker';

export default function App() {
  const [file, setFile] = useState<null | {
    filePath: string;
    fileName: string;
  }>(null);
  const [processedFile, setProcessedFile] = useState<null | string>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedPlayerOnce, setPlayedPlayerOnce] = useState(false);
  const [playbackTime, setPlaybackTime] = useState<null | number>(null);
  const [fileDuration, setFileDuration] = useState<null | number>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [playRate, setPlayRate] = useState(1);

  const getExtensionFromFileName = (fileName: string) =>
    fileName.split('.').pop();

  useEffect(() => {
    setInterval(() => {
      AudioProcessor.isPlaying().then((i) => {
        setIsPlaying(i);
        if (i) {
          AudioProcessor.getPlaybackTime().then((j) => {
            setPlaybackTime(j);
          });
        }
      });
    }, 200);
  }, []);

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
        <ActivityIndicator size="large" />
      ) : (
        <>
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
          />
          {!!file && (
            <>
              <Text>Play Rate: {playRate.toPrecision(3)}</Text>
              <Slider
                style={{ width: '80%' }}
                minimumValue={0.25}
                maximumValue={4}
                minimumTrackTintColor="#55f"
                maximumTrackTintColor="#999"
                value={playRate}
                step={0.05}
                onValueChange={setPlayRate}
              />
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
                title="Process source file"
              />
              <>
                {!isPlaying ? (
                  <>
                    {playedPlayerOnce && (
                      <Button
                        onPress={async () => {
                          await AudioProcessor.play();
                          getFileDuration();
                        }}
                        title="Continue playing"
                      />
                    )}
                    <Button
                      onPress={async () => {
                        await AudioProcessor.playFile(file.filePath);
                        getFileDuration();
                        if (!playedPlayerOnce) setPlayedPlayerOnce(true);
                      }}
                      title="Play source file"
                    />
                    {!!processedFile && (
                      <Button
                        onPress={async () => {
                          await AudioProcessor.playFile(processedFile);
                          getFileDuration();
                          if (!playedPlayerOnce) setPlayedPlayerOnce(true);
                        }}
                        title="Play processed file"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Button
                      onPress={() => AudioProcessor.pausePlayer()}
                      title="Pause playing"
                    />
                  </>
                )}
                <Text>
                  {formatDuration(playbackTime ?? 0)}/
                  {formatDuration(fileDuration ?? 0)}
                </Text>
              </>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
