import React, { useState } from "react";
import TokenSelector from "../TokenSelector/TokenSelector";
import { useWeb3Context } from "../../context";
import Text from "../Custom/Text";

const AddToken = () => {
  const [amount, setAmount] = useState<string>("");
  const { loading, contract, selectedToken, setError } = useWeb3Context();

  const addToken = async () => {
    try {
      await contract!.addNewToken(selectedToken.address);
    } catch (error: any) {
      console.log(error.reason)
      setError(error);
    }
  };

  return (
    <div className="h-full relative">
      <h1 className="mb-2">Select Token:</h1>
      <TokenSelector setAmount={setAmount} onlyToken amount={amount} />
      <br />
      <div className="h-max absolute w-full bottom-0">
        <div className="h-[1px] my-4 w-full bg-gray-600" />
        <button
          disabled={loading}
          onClick={addToken}
          className={`bg-blue-700 w-full py-3 px-3 mb-3 rounded-lg justify-center items-center flex`}
        >
          <Text>{loading ? "Loading..." : "Add Token"}</Text>
        </button>
      </div>
    </div>
  );
};

export default AddToken;
