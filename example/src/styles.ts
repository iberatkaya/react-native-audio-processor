import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  pageView: {
    width: '100%',
    height: 260,
    marginBottom: 16,
  },
  pickerContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  loadingContainer: {
    height: '100%',
    justifyContent: 'center',
  },
  audioPickerButton: {
    marginBottom: 16,
    alignSelf: 'center',
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
    marginTop: 40,
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
  resetButton: {
    backgroundColor: '#cc0000',
    marginBottom: 16,
  },
  playbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  settingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    borderRadius: 24,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#777',
  },
  settingScrollView: {
    paddingVertical: 16,
  },
  fileSelectedContainer: {
    alignItems: 'center',
  },
});
