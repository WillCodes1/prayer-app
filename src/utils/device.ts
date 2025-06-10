// Detect if the app is running in a mobile web view
export const isMobileWebView = (): boolean => {
  // iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  // WebView detection for iOS
  const isWebViewIOS = isIOS && (window as any).webkit && !(window as any).chrome;
  
  // Android detection
  const isAndroid = /Android/.test(navigator.userAgent);
  // WebView detection for Android
  const isWebViewAndroid = isAndroid && (window as any).callPhantom || 
                         (window as any).Phantom || 
                         (window as any).phantom;
  
  return isWebViewIOS || isWebViewAndroid || 
         (navigator.userAgent.includes('wv') && (isIOS || isAndroid));
};

// Check if the device is iOS
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// Check if the device is Android
export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};
