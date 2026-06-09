const React = require('react');
const { Text } = require('react-native');
const MockIcon = ({ name, testID }) => React.createElement(Text, { testID }, name);
module.exports = {
  Ionicons: MockIcon,
  MaterialIcons: MockIcon,
  FontAwesome: MockIcon,
  AntDesign: MockIcon,
};
