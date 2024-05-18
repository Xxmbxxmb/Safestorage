interface ButtonProps {
  title: string;
  handleClick: () => void;
  restStyles?: string;
}

const Button = ({
  restStyles,
  title,
  handleClick,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`px-4 py-2 rounded-lg bg-gray-900/80 w-fit text-white font-rajdhani font-bold ${restStyles}`}
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

export default Button;
