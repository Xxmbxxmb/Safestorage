import React, { useEffect, useState } from "react";
import TokenSelector from "../TokenSelector/TokenSelector";
import Input from "../Custom/CustomInput";
import { useWeb3Context } from "../../context";
import Text from "../Custom/Text";
import useSmartContract from "../../hooks/useSmartContract";
import { ethers } from "ethers";
import Signatures from "./Signatures";

const Transfer = ({
  showHash,
  setShowHashes,
}: {
  showHash: boolean;
  setShowHashes: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txSignatures, setTxSignatures] = useState<string[]>([]);
  const { loading, selectedToken, contract, setBalance, setLoading, setError } =
    useWeb3Context();
  const { getUserBalance } = useSmartContract();

  const transfer = async () => {
    try {
      setLoading(true);
      const tokenAmount = ethers.parseUnits(amount, selectedToken.decimals);
      const transaction = await contract!.withdraw(
        toAddress,
        selectedToken.address,
        tokenAmount
      );
      setTxSignatures([transaction.hash]);
      setShowHashes(true);
      setAmount("");
      setLoading(false);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    contract &&
      selectedToken &&
      getUserBalance(selectedToken?.address).then((r: bigint) => setBalance(r));
  }, [selectedToken]);

  return showHash ? (
    <Signatures
      txSignatures={txSignatures}
      setTxSignatures={setTxSignatures}
      setShowHashes={setShowHashes}
    />
  ) : (
    <div className="h-full relative">
      <h1 className="mb-2">Select Token:</h1>
      <TokenSelector setAmount={setAmount} amount={amount} />
      <br />
      <h1 className="mb-2">Destination Address:</h1>
      <Input onChange={(e) => setToAddress(e.currentTarget.value)} />
      <div className="h-max absolute w-full bottom-0">
        <div className="h-[1px] my-4 w-full bg-gray-600" />
        <button
          disabled={loading}
          onClick={transfer}
          className={`bg-blue-700 w-full py-3 px-3 mb-3 rounded-lg justify-center items-center flex`}
        >
          <Text>{loading ? "Loading..." : "Transfer"}</Text>
        </button>
      </div>
    </div>
  );
};

export default Transfer;
