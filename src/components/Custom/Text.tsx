import React from "react";

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: string;
}

const Text: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <p
      style={{ color: "white" }}
      {...props}
    >
      {children}
    </p>
  );
};

export default Text;
