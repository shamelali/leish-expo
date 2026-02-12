// Ensure Basic NativeModules mock exists before jest-expo setup runs
try {
  const resolved = require.resolve('react-native/Libraries/BatchedBridge/NativeModules');
  if (!require.cache[resolved] || !require.cache[resolved].exports) {
    require.cache[resolved] = {
      id: resolved,
      filename: resolved,
      loaded: true,
      exports: {},
    };
  }
} catch (e) {
  // ignore if module can't be resolved in this environment
}
