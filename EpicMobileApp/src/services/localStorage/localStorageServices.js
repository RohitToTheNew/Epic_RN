import AsyncStorage from '@react-native-async-storage/async-storage';

export default class AsyncStorageServices {
  static setItem(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }
  static getItem(key) {
    return AsyncStorage.getItem(key).then(item => {
      return JSON.parse(item);
    });
  }
  static removeItem(key) {
    return AsyncStorage.removeItem(key);
  }
  static removeAll() {
    return AsyncStorage.clear();
  }
}
