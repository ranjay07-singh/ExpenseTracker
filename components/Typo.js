import { colors } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { StyleSheet, Text } from 'react-native';

const Typo = ({
  size,
  color = colors.neutral900,
  fontWeight = '400',
  children,
  style,
  textProps = {},
}) => {
  const textStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(18),
    color,
    fontWeight,
  };

  return (
    <Text style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;

const styles = StyleSheet.create({});
