import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CustomTabs({ state, descriptors, navigation }) {
  const tabbarIcons = {
    index: (isFocused) => (
      <Icons.House
        size={verticalScale(30)}
        weight={isFocused ? 'fill' : 'regular'}
        color={isFocused ? colors.primary : colors.neutral50}
      />
    ),
    statistics: (isFocused) => (
      <Icons.ChartBar
        size={verticalScale(30)}
        weight={isFocused ? 'fill' : 'regular'}
        color={isFocused ? colors.primary : colors.neutral50}
      />
    ),
    wallet: (isFocused) => (
      <Icons.Wallet
        size={verticalScale(30)}
        weight={isFocused ? 'fill' : 'regular'}
        color={isFocused ? colors.primary : colors.neutral50}
      />
    ),
    TipsScreen: (isFocused) => (
      <Icons.BookOpen
        size={verticalScale(30)}
        weight={isFocused ? 'fill' : 'regular'}
        color={isFocused ? colors.primary : colors.neutral50}
      />
    ),
    profile: (isFocused) => (
      <Icons.User
        size={verticalScale(30)}
        weight={isFocused ? 'fill' : 'regular'}
        color={isFocused ? colors.primary : colors.neutral50}
      />
    ),
  };

  return (
    <View style={styles.tabber}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabber: {
    flexDirection: 'row',
    width: '100%',
    height: Platform.OS === 'ios' ? verticalScale(73) : verticalScale(55),
    backgroundColor: colors.neutral800,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: colors.neutral800,
    borderTopWidth: 1,
  },
  tabbarItem: {
    marginBottom: Platform.OS === 'ios' ? spacingY._10 : spacingY._5,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
