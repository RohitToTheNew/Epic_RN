import RNFetchBlob from 'rn-fetch-blob';

const rnfetchInstance = RNFetchBlob.config({
  trusty: true,
  timeout: 15000,
});

const header = {
  'Content-Type': 'application/json',
  'device-type': 'mobile'
};

export default {
  rnfetchInstance: rnfetchInstance,
  header,
};
