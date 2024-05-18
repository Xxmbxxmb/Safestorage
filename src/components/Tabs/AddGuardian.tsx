import React, { useEffect, useState } from "react";
import Input from "../Custom/CustomInput";
import { useWeb3Context } from "../../context";
import Text from "../Custom/Text";

const AddGuardian = () => {
  const { loading, contract, setLoading, setError } = useWeb3Context();
  const [address, setAddress] = useState<string>("");
  const [guardians, setGuardians] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(-1);

  const addGuardian = async () => {
    try {
      await contract!.addGuardian(address, index);
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    contract!.getGuardians().then((r: string[]) => {
      setGuardians(r);
    });
  }, []);

  return (
    <div className="h-full relative">
      <h1 className="mb-2">Add a new guardian:</h1>
      <Input
        value={address}
        placeholder="Enter guardian address"
        onChange={(e) => setAddress(e.currentTarget.value)}
      />

      {guardians.length ? (
        <>
          <h1 className="self-start mb-2 mt-4">Select an empty slot:</h1>
          <div className="flex flex-col rounded-xl border border-gray-600 py-2 justify-center items-center">
            {guardians.map((g, i) => (
              <button
                onClick={() => setIndex(i)}
                className={`my-0.5 p-1.5 rounded ${
                  index === i ? "bg-gray-700/60" : ""
                }`}
                key={`guardian-${i}`}
              >
                {g}
              </button>
            ))}
          </div>
        </>
      ) : null}

      <div className="h-max absolute w-full bottom-0">
        <div className="h-[1px] my-4 w-full bg-gray-600" />
        <button
          disabled={loading}
          onClick={addGuardian}
          className={`bg-blue-700 w-full py-3 px-3 mb-3 rounded-lg justify-center items-center flex`}
        >
          <Text>{loading ? "Loading..." : "Add Guardian"}</Text>
        </button>
      </div>
    </div>
  );
};

export default AddGuardian;
