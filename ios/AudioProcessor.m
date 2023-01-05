#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AudioProcessor, NSObject)

RCT_EXTERN_METHOD(playFile: (NSString *) pathStr
                  withResolver: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(getFileSampleRate: (NSString *) pathStr
                  withResolver: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(play: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(stopPlayer: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(getDuration: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(getPlaybackTime: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(isPlaying: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(pausePlayer: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

RCT_EXTERN_METHOD(processFile: (NSString *) pathStr
                  withOutputFileName: (NSString *) outputFileName
                  withOptions: (NSDictionary *) options
                  withResolver: (RCTPromiseResolveBlock) resolve
                  withRejecter: (RCTPromiseRejectBlock) reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
