import Foundation
import AVKit

enum ProcessingError: Error {
    case fileAccessError
}

struct ProcessingSettings {
    init(reverb: Int?, delay: Int?, delayTimeInMS: Int?, delayFeedback: Int?, delayLowPassCutoff: Int?, distortionAmount: Int?, distortionGain: Int?, pitchAmount: Int?, pitchOverlap: Float?, pitchRate: Float?, playRate: Float?) {
        self.reverb = reverb ?? 0
        self.delay = delay ?? 0
        self.delayTimeInMS = delayTimeInMS ?? 1000
        self.delayFeedback = delayFeedback ?? 50
        self.delayLowPassCutoff = delayLowPassCutoff ?? 15000
        self.distortionGain = distortionGain ?? -6
        self.distortionAmount = distortionAmount ?? 0
        self.pitchRate = pitchRate ?? 1.0
        self.pitchAmount = pitchAmount ?? 0
        self.pitchOverlap = pitchOverlap ?? 8.0
        self.playRate = playRate ?? 1.0
    }
    
    static func fromJson(json: NSDictionary) -> ProcessingSettings {
        return ProcessingSettings(
            reverb: json["reverb"] as? Int,
            delay: json["delay"] as? Int,
            delayTimeInMS: json["delayTimeInMS"] as? Int,
            delayFeedback: json["delayFeedback"] as? Int,
            delayLowPassCutoff: json["delayLowPassCutoff"] as? Int,
            distortionAmount: json["distortionAmount"] as? Int,
            distortionGain: json["distortionGain"] as? Int,
            pitchAmount: json["pitchAmount"] as? Int,
            pitchOverlap: json["pitchOverlap"] as? Float,
            pitchRate: json["pitchRate"] as? Float,
            playRate: json["playRate"] as? Float
        )
    }
    
    /// You specify the blend as a percentage. The range is 0% through 100%, where 0% represents all dry.
    let reverb: Int
    
    /// You specify the blend as a percentage. The default value is 100%. The valid range of values is 0% through 100%, where 0% represents all dry.
    let delay: Int
    
    /// The amount of the output signal that feeds back into the delay line. You specify the feedback as a percentage. The default value is 50%. The valid range of values is -100% to 100%.
    let delayFeedback: Int
    
    /// You specify the delay in seconds. The default value is 1000. The valid range of values is 0 to 2 seconds.
    let delayTimeInMS: Int
    
    /// The cutoff frequency above which high frequency content rolls off, in hertz.
    /// The default value is 15000 Hz. The valid range of values is 10 Hz through (sampleRate/2).
    let delayLowPassCutoff: Int
    
    /// You specify the blend as a percentage. The default value is 50%. The valid range is 0% through 100%, where 0 represents all dry.
    let distortionAmount: Int
    
    /// The gain that the audio unit applies to the signal before distortion, in decibels.
    /// The default value is -6 dB. The valid range of values is -80 dB to 20 dB.
    let distortionGain: Int

    /// The audio unit measures the pitch in cents, a logarithmic value you use for measuring musical intervals. One octave is equal to 1200 cents. One musical semitone is equal to 100 cents.
    /// The default value is 0.0. The range of values is -2400 to 2400.
    let pitchAmount: Int

    /// A higher value results in fewer artifacts in the output signal. The default value is 8.0. The range of values is 3.0 to 32.0.
    let pitchOverlap: Float
    
    /// The default value is 1.0. The range of supported values is 1/32 to 32.0.
    let pitchRate: Float
    
    /// The audio playback rate. The default value is 1.0. The range of values is 0.25 to 4.0.
    let playRate: Float
}

@objc(AudioProcessor)
class AudioProcessor: RCTEventEmitter, AVAudioPlayerDelegate {
    var player: AVAudioPlayer?
    
    let SONG_IS_PLAYING: String = "SONG_IS_PLAYING";
    
    override func supportedEvents() -> [String]! {
      return [SONG_IS_PLAYING]
    }
    
    var hasListener: Bool = false

    override func startObserving() {
        hasListener = true
        self.sendEvent(withName: self.SONG_IS_PLAYING, body: (player?.isPlaying ?? false))
        
    }

    override func stopObserving() {
        self.sendEvent(withName: self.SONG_IS_PLAYING, body: nil)
        hasListener = false
    }
    
    
    func dispatchSongIsPlaying() {
        if (!hasListener) {
            return
        }
        
        self.sendEvent(withName: self.SONG_IS_PLAYING, body: true)
    }
    
    func dispatchSongStoppedPlaying() {
        if (!hasListener) {
            return
        }
        
        self.sendEvent(withName: self.SONG_IS_PLAYING, body: false)
    }
    
    @objc(playFile: withResolver: withRejecter:)
    func playFile(_ pathStr: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let path = URL(string: pathStr)!
        // File might be secure
        _ = path.startAccessingSecurityScopedResource()
        do {
            _ = stopPlayerInternal()
            try setupPlayer(path: path)
            resolve(true)
        } catch {
            reject("AudioProcessorError", error.localizedDescription, error)
        }
    }
    
    func setupPlayer(path: URL) throws {
        try AVAudioSession.sharedInstance().setCategory(.playback)
        player = try AVAudioPlayer(contentsOf: path)
        player?.delegate = self
        player?.prepareToPlay()
        player?.play()
        dispatchSongIsPlaying()
    }
    
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        dispatchSongStoppedPlaying()
    }
    
    func audioPlayerDecodeErrorDidOccur(_ player: AVAudioPlayer, error: Error?) {
        dispatchSongStoppedPlaying()
    }
    
    @objc(play: withRejecter:)
    func play(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let player {
            player.play()
            dispatchSongIsPlaying()
            resolve(true)
        } else {
            resolve(false)
        }
    }
    
    @objc(stopPlayer: withRejecter:)
    func stopPlayer(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let stopped = stopPlayerInternal()
        resolve(stopped)
    }
    
    @objc(pausePlayer: withRejecter:)
    func pausePlayer(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let player {
            player.pause()
            dispatchSongStoppedPlaying()
            resolve(true)
        } else {
            resolve(false)
        }
    }

    @objc(isPlaying: withRejecter:)
    func isPlaying(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(player?.isPlaying ?? false)
    }
    
    func stopPlayerInternal() -> Bool {
        if let player, player.isPlaying {
            player.stop()
            dispatchSongStoppedPlaying()
            return true
        }
        return false
    }
    
    @objc(getFileSampleRate: withResolver: withRejecter:)
    func getFileSampleRate(_ pathStr: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let path = URL(string: pathStr)!
        let sourceFile: AVAudioFile
        do {
            _ = path.startAccessingSecurityScopedResource()
            sourceFile = try AVAudioFile(forReading: path)
            
            resolve(sourceFile.fileFormat.sampleRate)
        } catch {
            reject("AudioProcessorError", error.localizedDescription, error)
        }
    }
    
    @objc(getPlaybackTime: withRejecter:)
    func getPlaybackTime(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock)  {
        if let player {
            resolve(Int(player.currentTime))
        } else {
            resolve(nil)
        }
    }

    @objc(setPlaybackTime: withResolver: withRejecter:)
    func setPlaybackTime(time: NSNumber, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if let player {
            if Int(player.duration) < Int(truncating: time) {
                reject("AudioProcessorError", "Time \(time) cannot be great than the track duration \(Int(player.duration))", nil)
            } else if Int(truncating: time) < 0 {
                reject("AudioProcessorError", "Time \(time) cannot be less than 0", nil)
            } else {
                player.currentTime = TimeInterval(truncating: time)
                resolve(true)
            }
        } else {
            resolve(false)
        }
    }
    
    @objc(getDuration: withRejecter:)
    func getDuration(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock)  {
        if let player {
            resolve(Int(player.duration))
        } else {
            resolve(nil)
        }
    }
    
    @objc(processFile: withOutputFileName: withOptions: withResolver: withRejecter:)
    func processFile(_ pathStr: String, outputFileName: String, options: NSDictionary, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let settings = ProcessingSettings.fromJson(json: options)
        
        let path = URL(string: pathStr)!
        let sourceFile: AVAudioFile
        let format: AVAudioFormat
        do {
            _ = path.startAccessingSecurityScopedResource()
            sourceFile = try AVAudioFile(forReading: path)
            format = sourceFile.processingFormat
        } catch {
            reject("AudioProcessorError", error.localizedDescription, error)
            return
        }

        let engine = AVAudioEngine()
        let playerNode = AVAudioPlayerNode()
        let reverbNode = AVAudioUnitReverb()
        let delayNode = AVAudioUnitDelay()
        let distortionNode = AVAudioUnitDistortion()
        let pitchNode = AVAudioUnitTimePitch()
        let playRateNode = AVAudioUnitVarispeed()

        engine.attach(playerNode)
        
        engine.attach(reverbNode)
        reverbNode.loadFactoryPreset(.mediumHall)
        reverbNode.wetDryMix = Float(settings.reverb)
        
        engine.attach(delayNode)
        delayNode.delayTime = TimeInterval(Float(settings.delayTimeInMS) / 1000)
        delayNode.wetDryMix = Float(settings.delay)
        delayNode.feedback = Float(settings.delayFeedback) / 100
        delayNode.lowPassCutoff = Float(settings.delayLowPassCutoff)
        
        engine.attach(distortionNode)
        distortionNode.wetDryMix = Float(settings.distortionAmount)
        distortionNode.preGain = Float(settings.distortionGain)
        
        engine.attach(pitchNode)
        pitchNode.overlap = settings.pitchOverlap
        pitchNode.rate = settings.pitchRate
        pitchNode.pitch = Float(settings.pitchAmount)
        
        engine.attach(playRateNode)
        playRateNode.rate = settings.playRate
        
        engine.connect(playerNode, to: reverbNode, format: format)
        engine.connect(reverbNode, to: delayNode, format: format)
        engine.connect(delayNode, to: distortionNode, format: format)
        engine.connect(distortionNode, to: pitchNode, format: format)
        engine.connect(pitchNode, to: playRateNode, format: format)
        engine.connect(playRateNode, to: engine.mainMixerNode, format: format)
        

        // Schedule the source file.
        playerNode.scheduleFile(sourceFile, at: nil)
        
        do {
            // The maximum number of frames the engine renders in any single render call.
            let maxFrames: AVAudioFrameCount = 4096
            try engine.enableManualRenderingMode(.offline, format: format,
                                                 maximumFrameCount: maxFrames)
        } catch {
            reject("AudioProcessorError", error.localizedDescription, error)
            return
        }
        
        do {
            try engine.start()
            playerNode.play()
        } catch {
            reject("AudioProcessorError", error.localizedDescription, error)
            return
        }
        
        // The output buffer to which the engine renders the processed data.
        let buffer = AVAudioPCMBuffer(pcmFormat: engine.manualRenderingFormat,
                                      frameCapacity: engine.manualRenderingMaximumFrameCount)!

        var outputFile: AVAudioFile!
        do {
            let documentsURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask)[0]
            let outputURL = documentsURL.appendingPathComponent(outputFileName)
            outputFile = try AVAudioFile(forWriting: outputURL, settings: sourceFile.fileFormat.settings)
        } catch {
            reject("AudioProcessorError", error.localizedDescription, error)
            return
        }
        
        while engine.manualRenderingSampleTime < sourceFile.length {
            do {
                let frameCount = sourceFile.length - engine.manualRenderingSampleTime
                let framesToRender = min(AVAudioFrameCount(frameCount), buffer.frameCapacity)
                
                let status = try engine.renderOffline(framesToRender, to: buffer)
                switch status {
                    
                case .success:
                    // The data rendered successfully. Write it to the output file.
                    try outputFile.write(from: buffer)
                    
                case .insufficientDataFromInputNode:
                    // Applicable only when using the input node as one of the sources.
                    break
                    
                case .cannotDoInCurrentContext:
                    // The engine couldn't render in the current render call.
                    // Retry in the next iteration.
                    break
                    
                case .error:
                    // An error occurred while rendering the audio.
                    reject("AudioProcessorError", "The manual rendering failed.", nil)
                    return
                }
            } catch {
                reject("AudioProcessorError", error.localizedDescription, error)
                return
            }
        }

        // Stop the player node and engine.
        playerNode.stop()
        engine.stop()
        
        resolve(outputFile.url.path)
    }
}
