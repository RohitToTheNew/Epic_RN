import 'react-native';
import React from 'react';
import {render} from '@testing-library/react-native';
import ChangePassword from '../../../src/screens/changePassword';
import renderer from 'react-test-renderer';

const navigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('ChangePasswordScreen Component', () => {
  it('should match the snapshot', () => {
    jest.spyOn(React, 'createRef').mockImplementation(() => {});
    const tree = renderer.create(<ChangePassword />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('render the component correctly', () => {
    const {getByTestId} = render(<ChangePassword navigation={navigation} />);
    expect(getByTestId('changePasswordScreen')).toBeTruthy();
  });
});
