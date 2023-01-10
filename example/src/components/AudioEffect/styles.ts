import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    marginBottom: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#999',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'center',
  },
  slider: {
    width: '70%',
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
