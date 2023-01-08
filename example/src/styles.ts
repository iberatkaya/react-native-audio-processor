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
    backgroundColor: '#6b6',
    marginBottom: 16,
  },
  buttonsContainer: {},
  playSourceButton: {
    backgroundColor: '#6b6',
    marginBottom: 16,
  },
  playProcessedButton: {
    backgroundColor: '#6b6',
    marginBottom: 16,
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
  backIcon: {
    marginRight: 8,
    paddingLeft: 4,
  },
  forwardIcon: {
    marginLeft: 8,
    paddingLeft: 4,
  },
  pauseButton: {
    backgroundColor: '#c55',
  },
  playbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});
