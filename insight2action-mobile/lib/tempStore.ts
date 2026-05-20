/**
 * Temporary in-memory store for objects that can't be serialized 
 * (like File/Blob objects). Survives navigation but not app restart.
 */

let _tempFile: { uri: string; name: string; type: string; file?: File | null } | null = null;

export function setTempFile(file: { uri: string; name: string; type: string; file?: File | null } | null) {
  _tempFile = file;
}

export function getTempFile() {
  return _tempFile;
}

export function clearTempFile() {
  _tempFile = null;
}
