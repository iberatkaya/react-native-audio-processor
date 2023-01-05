import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioPickerButton: {
    marginBottom: 16,
  },
  playRateText: {
    marginBottom: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#999',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  slider: {
    width: '75%',
  },
  processButton: {
    marginBottom: 16,
    backgroundColor: '#ffa100',
  },
  continueButton: {
    marginBottom: 16,
    backgroundColor: '#6b6',
  },
  playSourceButton: {
    marginBottom: 16,
    backgroundColor: '#6b6',
  },
  playProcessedButton: {
    marginBottom: 16,
    backgroundColor: '#6b6',
  },
  pauseButton: {
    marginBottom: 16,
    backgroundColor: '#c55',
  },
  playbackText: {
    textDecorationLine: 'underline',
    color: '#262',
    fontSize: 18,
    marginBottom: 16,
  },
  fileNameText: {
    color: '#333',
    fontSize: 15,
    width: '80%',
    marginBottom: 16,
    textAlign: 'center',
  },
  minimumText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
  },
  maximumText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  sliderRow: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});
