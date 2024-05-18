function NavItem(props: {
  title: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return props.disabled ? null : (
    <button onClick={() => props.onClick()} disabled={props.disabled}>
      <div
        className={`py-4 cursor-pointer text-white flex flex-row items-center space-x-3`}
      >
        <div
          className={`${
            props.active
              ? "bg-blue-900 text-blue-400"
              : "bg-gray-700 text-gray-400"
          } flex h-8 w-8 items-center justify-center rounded-lg`}
        >
          {props.icon}
        </div>
        <h1 className={`font-medium ${props.disabled ? "text-gray-500" : ""}`}>
          {props.title}
        </h1>
      </div>
    </button>
  );
}

export default NavItem;
