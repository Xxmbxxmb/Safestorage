import Text from "../Custom/Text";
import TokenImage from "./TokenImage";

function TokenCard(props: {
  title: string;
  symbol: string;
  image?: string;
  address: string;
  onSelect: () => void;
  amount?: string;
  loading?: boolean;
}) {
  return (
    <button onClick={props.onSelect}>
      <div className="flex flex-row px-4 py-2 space-x-2 items-center ">
        <div>
          <TokenImage image={props?.image} symbol={props?.symbol} />
        </div>
        <div className="flex-1 flex-col">
          <Text>{props.title}</Text>
          <Text>{props.symbol}</Text>
        </div>
        <div>
          {props.loading ? (
            <Text>...</Text>
          ) : (
            <>
              {props.amount && (
                <Text className="text-right">{props?.amount}</Text>
              )}
            </>
          )}
        </div>
      </div>
    </button>
  );
}

export default TokenCard;
