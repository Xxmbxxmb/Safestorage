import { useWeb3Context } from "../../context";
import TokenSelector from "../TokenSelector/TokenSelector";
import Text from "../Custom/Text";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Contract } from "ethers";
import { ERC20_ABI } from "../../contract/ERC20";
import useSmartContract from "../../hooks/useSmartContract";
import { CONTRACT_ADDRESS } from "../../contract";
import Signatures from "./Signatures";
import { TransactionResponse } from "ethers";
import { requestAccount, requestBalance } from "../../utils/onboard";

const Deposit = ({
  showHash,
  setShowHashes,
}: {
  showHash: boolean;
  setShowHashes: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    loading,
    selectedToken,
    signer,
    walletAddress,
    setError,
    setLoading,
    setBalance,
  } = useWeb3Context();
  const { checkAndSetAllowance, deposit, createContractInterface } =
    useSmartContract();
  const [amount, setAmount] = useState<string>("");
  const [txSignatures, setTxSignatures] = useState<string[]>([]);

  const depositOnSmartContract = async () => {
    try {
      setLoading(true);
      const hashes = [];
      if (selectedToken.address === ethers.ZeroAddress) {
        const transaction = {
          to: CONTRACT_ADDRESS,
          value: ethers.parseUnits(amount, 18),
        };
        const tx: TransactionResponse | undefined =
          await signer?.sendTransaction(transaction);
        if (tx) hashes.push(tx.hash);
        setTxSignatures(hashes)
      } else {
        const tokenContract = createContractInterface(selectedToken.address);
        const allowanceTx = await checkAndSetAllowance(tokenContract, amount);
        hashes.push(allowanceTx.hash);
        const depositTx = await deposit(tokenContract, amount);
        hashes.push(depositTx.hash);
        setTxSignatures(hashes);
      }
      if (hashes.length > 0) setShowHashes(true);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
      setAmount("");
    }
  };

  useEffect(() => {
    const getMetamaskBalance = async () => {
      if (selectedToken.address === ethers.ZeroAddress) {
        const currentAccount = await requestAccount();
        const { currentBalance } = await requestBalance(currentAccount);
        setBalance(currentBalance);
      } else {
        const contractInterface = new Contract(
          selectedToken.address,
          ERC20_ABI,
          signer
        );

        const balance = await contractInterface.balanceOf(walletAddress);
        setBalance(balance);
      }
    };
    if (selectedToken) getMetamaskBalance();
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
      <TokenSelector amount={amount} setAmount={setAmount} />

      <div className="h-max absolute w-full bottom-0 z-0">
        <div className="h-[1px] my-4 w-full bg-gray-600" />
        <button
          disabled={loading}
          onClick={depositOnSmartContract}
          className={`bg-blue-700 w-full py-3 px-3 mb-3 rounded-lg justify-center items-center flex`}
        >
          <Text>{loading ? "Loading..." : "Deposit"}</Text>
        </button>
      </div>
    </div>
  );
};

export default Deposit;
