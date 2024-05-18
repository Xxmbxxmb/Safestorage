import React from "react";
import { colorAlert, colorInputBorder, colorPrimary } from "../../utils/colors";

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  isInvalid?: boolean;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  fontSize?: number;
}

export default function Input({
  style,
  inputStyle,
  leftIcon,
  rightIcon,
  isInvalid,
  fontSize,
  ...otherProps
}: InputProps) {
  const [isFocus, setIsFocus] = React.useState(false);
  const handleFocus = (state: boolean) => setIsFocus(state);

  return (
    <div
      className="bg-gray-800 flex"
      style={{
        width: "100%",
        alignSelf: "center",
        borderRadius: 8,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor:
          isInvalid === true
            ? colorAlert
            : isFocus
            ? colorPrimary
            : colorInputBorder,
        ...style
      }}
    >
      {leftIcon && <div style={{ marginRight: 10 }}>{leftIcon}</div>}
      <input
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        autoCorrect={"false"}
        style={{
          outline: 'none',
          fontSize: fontSize || 16,
          color: "white",
          flex: 1,
          backgroundColor: 'transparent',
          ...inputStyle,
        }}
        {...otherProps}
      />
      {rightIcon && <div style={{ marginLeft: 10 }}>{rightIcon}</div>}
    </div>
  );
}
