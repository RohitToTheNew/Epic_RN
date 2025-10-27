let store = {};

jest.mock('react-redux', () => {
  const ActualReactRedux = jest.requireActual('react-redux');
  return {
    ...ActualReactRedux,
    useSelector: () => {
      return store;
    },
    useDispatch: jest.fn().mockImplementation(() => {
      return () => {};
    }),
  };
});
