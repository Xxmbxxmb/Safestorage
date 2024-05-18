import { createContext, useContext, useEffect, useState } from "react";
import { ABI, CONTRACT_ADDRESS } from "../contract";
import { BrowserProvider, JsonRpcSigner, Contract } from "ethers";
import { Token } from "../types/token";
import axios, { AxiosResponse } from "axios";
import Web3Modal from "web3modal";
import { GetParams } from "../utils/onboard";

export interface ErrorMessage {
  status: boolean;
  message: string;
}

interface Web3Interface {
  contract: Contract | null;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  walletAddress: string;
  tokens: Token[];
  selectedToken: Token;
  balance: bigint;
  loading: boolean;
  owner: string;
  isOwner: boolean;
  guardians: string[];
  isGuardian: boolean;
  showError: ErrorMessage;
  setSelectedToken: React.Dispatch<React.SetStateAction<Token>>;
  setBalance: React.Dispatch<React.SetStateAction<bigint>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<any>>;
  updateWalletAddress: () => void;
}

const Web3Context = createContext<Web3Interface>({} as Web3Interface);

export const Web3ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [selectedToken, setSelectedToken] = useState<Token>({
    symbol: "BNB",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    name: "BNB",
    logoURI:
      "https://tokens.1inch.io/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png",
  });
  const [tokens, setTokens] = useState<Token[]>([]);
  const [owner, setOwner] = useState<string>("");
  const [guardians, setGuardians] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [contract, setContract] = useState<Contract | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<any>(null);
  const [showError, setShowError] = useState<ErrorMessage>({
    status: false,
    message: "",
  });
  const [walletAddress, setWalletAddress] = useState<string>("");

  const updateWalletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts) setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    const setSmartContractAndProvider = async () => {
      const newProvider = new BrowserProvider(window.ethereum);
      const signer = await newProvider.getSigner();
      const newContract: Contract = new Contract(CONTRACT_ADDRESS, ABI, signer);
      const ownerAddress = await newContract.owner();
      const guardians = (await newContract.getGuardians()).map((w: string) =>
        w.toLowerCase()
      );

      setOwner(ownerAddress);
      setGuardians(guardians);
      setContract(newContract);
      setProvider(newProvider);
      setSigner(signer);
    };
    setSmartContractAndProvider();
  }, []);

  useEffect(() => {
    const fetchTokens = async () => {
      const url: string = "https://api-g2eggt3ika-uc.a.run.app/supportedTokens";
      const response: AxiosResponse = await axios.get(url);
      setTokens(response.data.data["BINANCE"]);
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    updateWalletAddress();

    window.ethereum.on("accountsChanged", updateWalletAddress);
  }, []);

  useEffect(() => {
    const resetParams = async () => {
      const currentStep = await GetParams();
      setStep(currentStep.step);
    };

    resetParams();

    window?.ethereum?.on("chainChanged", () => resetParams());
    window?.ethereum?.on("accountsChanged", () => resetParams());
  }, []);

  useEffect(() => {
    if (error) {
      console.log(error);
      console.log(error.code);
      console.log(error.reason);
      let errorMessage: string = "";
      if (error.info && error.info.error) {
        const parsedError = error.info?.error?.message?.split(": ");
        errorMessage = parsedError[parsedError.length - 1];

        if (
          errorMessage.toLowerCase().includes("json-rpc error") &&
          error.info.error.data
        ) {
          errorMessage = error.info.error.data.message;
        }
      }

      if (errorMessage.toLowerCase().includes("json-rpc error")) {
        errorMessage = error.reason;
      }

      if (errorMessage.includes("execution reverted:")) {
        console.log(errorMessage)
        errorMessage = errorMessage.replace("execution reverted:", "");
      }

      setShowError({
        status: true,
        message: errorMessage,
      });
    } else {
      setShowError({
        status: false,
        message: "",
      });
    }
  }, [error]);

  return (
    <Web3Context.Provider
      value={{
        contract,
        provider,
        signer,
        tokens,
        walletAddress,
        loading,
        selectedToken,
        balance,
        guardians,
        isGuardian: guardians.includes(walletAddress.toLowerCase()),
        owner,
        isOwner: owner.toLowerCase() === walletAddress.toLowerCase(),
        showError,
        setSelectedToken,
        setBalance,
        setLoading,
        updateWalletAddress,
        setError,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => useContext(Web3Context);
