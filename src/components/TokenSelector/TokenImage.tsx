function TokenImage(props: { image?: string; symbol: string; size?: number }) {
  const size = props.size ?? 30;
  return props.image ? (
    <img
      src={props.image}
      style={{ height: size, width: size, borderRadius: size }}
    />
  ) : (
    <div
      className="rounded-full justify-center items-center bg-gray-500"
      style={{ height: size, width: size }}
    >
      <h1>{Array.from(props?.symbol)[0]}</h1>
    </div>
  );
}

export default TokenImage;
