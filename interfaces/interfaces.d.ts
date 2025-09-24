import { LinkProps } from "expo-router";
import { ReactNode } from "react";
import { ButtonProps, TextInputProps } from "react-native";

interface TabIconProps {
  icon: any;
  focused?: boolean;
}

interface CustomButtonsProps {
  title?: string;
  onPress: () => void;
  textStyle?: string;
  styles?: string;
  isLoading?: boolean;
  leftIcon?: any;
}

interface InputProps extends TextInputProps {
  labelStyle?: string;
  label?: string;
  type?: string;
  handleChangeText: (e: string) => void;
  placeholder?: string;
  value: string | undefined;
  inputStyle?: string;
  otherStyles?: string;
}

interface Description {
  name: string;
  amount: number;
  date: string;
}

interface Expense {
  category: string;
  description: Description | Description[];
  date: string;
}

interface Budget {
  _id?: string;
  name?: string;
  userId: number;
  income: number;
  maxBudget: number;
  expenses: Expense[] | Expense;
  currentTotal: number;
  savingsGoal: number;
}

interface BoxProps {
  children: ReactNode;
  cardStyles?: string;
  title?: string;
  titleRightText?: string;
  link?: string;
  headerShow?: boolean;
  headerStart?: string;
  headerEnd?: string;
  otherStyles?: string;
}
