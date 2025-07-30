import { Timestamp } from "firebase/firestore";
import React from "react";
import {
  TextInput
} from "react-native";

export const ScreenWrapperProps = {
  style: ViewStyle,
  children: React.ReactNode,
};

export const ModalWrapperProps = {
  style: ViewStyle,
  children: React.ReactNode,
  bg: String,
};

export const accountOptionType = {
  title: String,
  icon: React.ReactNode,
  bgColor: String,
  routeName: null, 
};

export const TypoProps = {
  size: Number,
  color: String,
  fontWeight: String, 
  children: null,
  style: Object, 
  textProps: Object, 
};

export const IconComponent = {
  height: Number,
  width: Number,
  strokeWidth: Number,
  color: String,
  fill: String,
};

export const IconProps = {
  name: String,
  color: String,
  size: Number,
  strokeWidth: Number,
  fill: String,
};

export const HeaderProps = {
  title: String,
  style: ViewStyle,
  leftIcon: React.ReactNode,
  rightIcon: React.ReactNode,
};

export const BackButtonProps = {
  style: ViewStyle,
  iconSize: Number,
};

export const TransactionType = {
  id: String,
  type: String,
  amount: Number,
  category: String,
  date: [Date, Timestamp], 
  description: String,
  image: Object,
  uid: String,
  walletId: String,
};

export const CategoryType = {
  label: String,
  value: String,
  icon: Icon,
  bgColor: String,
};

export const ExpenseCategoriesType = {}; 

export const TransactionListType = {
  data: Array, 
  title: String,
  loading: Boolean,
  emptyListMessage: String,
};

export const TransactionItemProps = {
  item: TransactionType,
  index: Number,
  handleClick: Function,
};

export const InputProps = {
  icon: React.ReactNode,
  containerStyle: ViewStyle,
  inputStyle: TextStyle,
  inputRef: React.createRef(TextInput), 
  label: String,
  error: String,
};

export const CustomButtonProps = {
  style: ViewStyle,
  onPress: Function,
  loading: Boolean,
  children: React.ReactNode,
};

export const ImageUploadProps = {
  file: Object,
  onSelect: Function,
  onClear: Function,
  containerStyle: ViewStyle,
  imageStyle: ViewStyle,
  placeholder: String,
};

export const UserType = {
  uid: String,
  email: String,
  name: String,
  image: Object,
};

export const UserDataType = {
  name: String,
  image: Object,
};

export const AuthContextType = {
  user: UserType,
  setUser: Function,
  login: Function,
  register: Function,
  updateUserData: Function,
};

export const ResponseType = {
  success: Boolean,
  data: Object,
  msg: String,
};

export const WalletType = {
  id: String,
  name: String,
  amount: Number,
  totalIncome: Number,
  totalExpenses: Number,
  image: Object,
  uid: String,
  created: Date,
};
