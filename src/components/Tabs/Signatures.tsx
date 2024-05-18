import React from "react";
import Text from "../Custom/Text";

const Signatures = ({
  txSignatures,
  setTxSignatures,
  setShowHashes,
}: {
  txSignatures: string[];
  setTxSignatures: React.Dispatch<React.SetStateAction<string[]>>;
  setShowHashes: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const openTab = (hash: string) =>
    window.open(`https://bscscan.com/tx/${hash}`, "_blank");
  return (
    <div>
      <Text>Transaction hashes</Text>
      <div className="border-t mt-2 pt-2 border-gray-500">
        <div className="space-y-2">
          <button
            onClick={() => {
              openTab(txSignatures[0]);
            }}
          >
            <span className="text-blue-300 font-bold text-sm">
              {`${
                txSignatures.length === 2 ? "Approval tx: " : "Transfer tx: "
              }`}
              (Click to see in explorer)
              {`\n${txSignatures[0]?.substring(
                0,
                15
              )}...${txSignatures[0]?.substring(45)}`}
            </span>
          </button>
          {txSignatures.length === 2 && (
            <button
              style={{marginTop: 20}}
              onClick={() => {
                openTab(txSignatures[0]);
              }}
            >
              <span className="text-blue-300 font-bold text-sm">
                Transfer tx: (Click to see in explorer)
                {`\n${txSignatures[1]?.substring(
                  0,
                  15
                )}...${txSignatures[1]?.substring(45)}`}
              </span>
            </button>
          )}
        </div>

        <button
          className="flex w-full justify-center"
          style={{marginTop: 20}}
          onClick={() => {
            setTxSignatures([]);
            setShowHashes(false);
          }}
        >
          <div className="bg-blue-500 rounded px-4 py-1 w-24 text-center">
            <Text>Continue</Text>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Signatures;
