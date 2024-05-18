import { useWeb3Context } from "../context";
import { Contract, ethers } from "ethers";
import { ERC20_ABI } from "../contract/ERC20";
import { CONTRACT_ADDRESS } from "../contract";

const useSmartContract = () => {
  const { contract, walletAddress, signer, setError } = useWeb3Context();

  const createContractInterface = (tokenAddress: string): Contract => {
    return new Contract(tokenAddress, ERC20_ABI, signer);
  };

  const getUserBalance = async (
    tokenAddress = ethers.ZeroAddress
  ): Promise<bigint> => {
    return contract!.getBalance(walletAddress, tokenAddress);
  };

  const getDecimals = async (tokenAddress: string): Promise<number> => {
    const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);

    return tokenContract.decimals();
  };

  const getAllowance = async (tokenAddress: string): Promise<bigint> => {
    const tokenContract = new Contract(tokenAddress, ERC20_ABI, signer);

    return tokenContract.allowance(walletAddress, CONTRACT_ADDRESS);
  };

  const checkAndSetAllowance = async (
    tokenInterface: Contract,
    amount: string
  ) => {
    try {
      const currentAllowance: bigint = await tokenInterface.allowance(
        walletAddress,
        CONTRACT_ADDRESS
      );

      const tokenDecimals: number = await tokenInterface.decimals();
      const parsedUnits: bigint = ethers.parseUnits(amount, tokenDecimals);

      if (currentAllowance < parsedUnits) {
        const tx = await tokenInterface.approve(CONTRACT_ADDRESS, parsedUnits);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return tx;
      }
    } catch (error: any) {
      setError(error);
    }
  };

  const tokenDeposit = async (tokenAddress: string, amount: string) => {
    const tokenInterface: Contract = new Contract(
      tokenAddress,
      ERC20_ABI,
      signer
    );
    const decimals: number = await tokenInterface.decimals();
    const parsedUnits: bigint = ethers.parseUnits(amount, decimals);
    await contract!.deposit(tokenAddress, parsedUnits);
  };

  const deposit = async (tokenInterface: Contract, amount: string) => {
    const decimals: number = await tokenInterface.decimals();
    const parsedUnits: bigint = ethers.parseUnits(amount, decimals);
    const tx = await contract!.deposit(
      await tokenInterface.getAddress(),
      parsedUnits
    );
    return tx;
  };

  return {
    createContractInterface,
    getUserBalance,
    getDecimals,
    getAllowance,
    tokenDeposit,
    checkAndSetAllowance,
    deposit,
  };
};

export default useSmartContract;
