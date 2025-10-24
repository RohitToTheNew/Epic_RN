import React from 'react';
import {FlatList} from 'react-native';
import styles from './styles';

const CustomFlatlist = ({
  data,
  renderItem,
  ListFooterComponent,
  ListHeaderComponent,
  style,
  ListEmptyComponent,
  ...props
}) => (
  <FlatList
    {...props}
    style={[styles.container, style]}
    showsVerticalScrollIndicator={false}
    data={data}
    renderItem={renderItem}
    keyExtractor={(item, index) => `item_${index}`}
    ListFooterComponent={ListFooterComponent}
    ListHeaderComponent={ListHeaderComponent}
    ListEmptyComponent={ListEmptyComponent}
  />
);

export default CustomFlatlist;
