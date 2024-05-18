import { useState } from "react";
import Input from "../Custom/CustomInput";
import { useWeb3Context } from "../../context";
import Text from "../Custom/Text";
import { toast } from "react-toastify";

const ProposeOwner = () => {
  const { loading, contract, setError, setLoading } = useWeb3Context();
  const [address, setAddress] = useState<string>("");

  const proposeOwner = async () => {
    try {
      setLoading(true);
      await contract!.addGuardian(address);
      toast(`You successfully proposed wallet: ${address} as new owner.`);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full relative">
      <h1 className="mb-2">New owner address:</h1>
      <Input
        value={address}
        placeholder="Please use a valid EVM address"
        onChange={(e) => setAddress(e.currentTarget.value)}
      />

      <div className="h-max absolute w-full bottom-0">
        <div className="h-[1px] my-4 w-full bg-gray-600" />
        <button
          disabled={loading}
          onClick={proposeOwner}
          className={`bg-blue-700 w-full py-3 px-3 mb-3 rounded-lg justify-center items-center flex`}
        >
          <Text>{loading ? "Loading..." : "Propose Owner"}</Text>
        </button>
      </div>
    </div>
  );
};

export default ProposeOwner;
