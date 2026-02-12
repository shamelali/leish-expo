/** @type {Detox.DetoxConfig} */
module.exports = {
  configurations: {
    'ios.sim.debug': {
      device: {
        type: 'ios.simulator',
        device: {
          type: 'iPhone 15',
        },
      },
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: {
        type: 'ios.simulator',
        device: {
          type: 'iPhone 15',
        },
      },
      app: 'ios.release',
    },
    'android.emu.debug': {
      device: {
        type: 'android.emulator',
        device: {
          avdName: 'Pixel_5_API_32',
        },
      },
      app: 'android.debug',
    },
    'android.emu.release': {
      device: {
        type: 'android.emulator',
        device: {
          avdName: 'Pixel_5_API_32',
        },
      },
      app: 'android.release',
    },
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/leish.app',
      build:
        'xcodebuild -workspace ios/leish.xcworkspace -scheme leish -configuration Debug -derivedDataPath ios/build -arch x86_64 -gpu_override off'
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Release-iphonesimulator/leish.app',
      build:
        'xcodebuild -workspace ios/leish.xcworkspace -scheme leish -configuration Release -derivedDataPath ios/build -arch x86_64 -gpu_override off'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build: 'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
      build: 'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },
  testRunner: 'jest',
};
