import { useState } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  defaultValue: string;
  blurCallback: (value: string) => void;
}

const EditableText: React.FC<InputProps> = (props: InputProps) => {
  const [text, setText] = useState(props.defaultValue);

  return (
    <input
      onBlur={() => props.blurCallback(text)}
      onChange={(e) => setText(e.target.value)}
      value={text}
      {...props}
      style={{
        fontFamily: "MedievalSharp",
        border: "none",
        background: "none",
        fontSize: 16,
        width: "100%",
        outline: "none",
        ...props.style,
      }}
    />
  );
};

export default EditableText;
