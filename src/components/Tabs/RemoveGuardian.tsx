import React, { useEffect, useState } from "react";
import { useWeb3Context } from "../../context";
import Text from "../Custom/Text";
import { ethers } from "ethers";
import { Robot } from "../../assets";
import { toast } from "react-toastify";

const RemoveGuardian = () => {
  const { loading, contract, setLoading, setError } = useWeb3Context();
  const [address, setAddress] = useState<string>("");
  const [index, setIndex] = useState<number>(0);
  const [guardians, setGuardians] = useState<string[]>([]);

  const removeGuardian = async () => {
    try {
      setLoading(true);
      await contract!.removeGuardian(address);
      toast(`You successfully removed guardian ${address}`);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    contract!.getGuardians().then((r: string[]) => {
      setGuardians(r.filter((g) => ethers.ZeroAddress !== g));
    });
  }, []);

  return guardians.length ? (
    <div className="h-full relative">
      <h1 className="self-start mb-2 mt-4">Select guardian to be removed:</h1>
      <div className="flex flex-col rounded-xl border border-gray-600 py-2 justify-center items-center">
        {guardians.map((g, i) => (
          <button
            onClick={() => setAddress(g)}
            className={`my-0.5 p-1.5 rounded ${
              index === i ? "bg-gray-700/60" : ""
            }`}
            key={`guardian-${i}`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="h-max absolute w-full bottom-0">
        <div className="h-[1px] my-4 w-full bg-gray-600" />
        <button
          disabled={loading}
          onClick={removeGuardian}
          className={`bg-blue-700 w-full py-3 px-3 mb-3 rounded-lg justify-center items-center flex`}
        >
          <Text>{loading ? "Loading..." : "Remove Guardian"}</Text>
        </button>
      </div>
    </div>
  ) : (
    <div className="h-full flex flex-col justify-center items-center">
      <img className="w-32 h-32" src={Robot} alt="robot" />
      <h1 className="text-black text-xl">There is no guardians yet.</h1>
    </div>
  );
};

export default RemoveGuardian;
