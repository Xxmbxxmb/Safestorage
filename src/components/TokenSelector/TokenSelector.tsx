import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useWeb3Context } from "../../context";
import TokenCard from "./TokenCard";
import Modal from "../Custom/Modal";
import TokenImage from "./TokenImage";
import Input from "../Custom/CustomInput";
import { ethers } from "ethers";
import Text from "../Custom/Text";

interface TokenSelectorProps {
  amount: string;
  onlyToken?: boolean;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
}
const TokenSelector = ({ amount, onlyToken, setAmount }: TokenSelectorProps) => {
  const { tokens, selectedToken, balance, loading, setSelectedToken } =
    useWeb3Context();
  const [search, setSearch] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div style={{ marginBottom: 10, width: "100%" }}>
      <div className="flex flex-row w-full" style={{ marginBottom: 4 }}>
        <>
          <Modal visible={visible}>
            <div className="bg-gray-900/80 w-full h-full flex justify-center items-center">
              {/* centered container */}
              <div className="max-w-md w-full max-h-[350px] h-full border border-gray-600 bg-gray-800 rounded-lg space-y-4 py-4 overflow-y-auto">
                {/* header */}
                <div className=" text-white px-4  flex flex-row items-center space-x-4">
                  <button onClick={() => setVisible(false)}>
                    <XMarkIcon style={{ height: 20, width: 20 }} />
                  </button>
                  <Text className="font-medium text-base">Select token</Text>
                </div>

                {/* search bar */}
                <div className="px-4">
                  <Input
                    onChange={(e) => setSearch(e.currentTarget.value)}
                    rightIcon={
                      <div className="text-gray-500">
                        <MagnifyingGlassIcon
                          style={{ height: 20, width: 20 }}
                        />
                      </div>
                    }
                  />
                </div>

                {/* tokens */}
                <div className="flex flex-col overflow-y-auto">
                  {/* loading */}
                  {loading && (
                    <div className="flex justify-center items-center">
                      <Text>Loading balances...</Text>
                    </div>
                  )}

                  {tokens
                    .filter(
                      (t) =>
                        t.name.toLowerCase().startsWith(search.toLowerCase()) ||
                        t.symbol.toLowerCase().startsWith(search.toLowerCase())
                    )
                    // .filter(filter)
                    .map((t) => (
                      <TokenCard
                        key={t.address}
                        title={t.name}
                        address={t.address}
                        symbol={t.symbol}
                        image={t.logoURI}
                        onSelect={() => {
                          setVisible(false);
                          setSelectedToken(t);
                        }}
                      />
                    ))}

                  {/* empty screen */}
                  {tokens.length === 0 && (
                    <div className="flex justify-center items-center">
                      <Text>No tokens found</Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>

          {/* open modal */}
          <button
            //   disabled={props.disabled}
            onClick={() => {
              setSearch("");
              setVisible(true);
            }}
          >
            {selectedToken ? (
              <div
                style={{ height: 42 }}
                className={`flex flex-row w-full items-center space-x-2 px-4 rounded-l-lg ${
                  loading ? "bg-gray-600/80" : "bg-gray-600"
                } ${onlyToken ? "rounded-r-lg" : ""}`}
              >
                <TokenImage
                  size={25}
                  image={selectedToken?.logoURI ?? ""}
                  symbol={selectedToken?.symbol ?? ""}
                />
                <Text>{selectedToken.symbol}</Text>
              </div>
            ) : (
              <div
                style={{ height: 42 }}
                className={`flex w-full flex-row items-center space-x-2 px-4 rounded-l-lg ${
                  loading ? "bg-gray-600/80" : "bg-gray-600"
                } ${onlyToken ? "rounded-r-lg" : ""}`}
              >
                <Text>Select Token</Text>
              </div>
            )}
          </button>
        </>

        {!onlyToken && (
          <>
            <Input
              value={amount}
              fontSize={14}
              onChange={(e) => setAmount(e.currentTarget.value)}
              style={{
                height: 42,
                padding: 10,
                width: 100,
                borderBottomLeftRadius: 0,
                borderTopLeftRadius: 0,
                overflow: "hidden",
              }}
            />
          </>
        )}
      </div>
      {balance ? (
        <>
          <Text className="text-xs">
            {`${ethers.formatUnits(balance, selectedToken?.decimals)} ${
              selectedToken?.symbol as string
            } available`}
          </Text>
        </>
      ) : (
        <Text className="text-xs">No balance available</Text>
      )}
    </div>
  );
};

export default TokenSelector;
