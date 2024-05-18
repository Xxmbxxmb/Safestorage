import { useState, useEffect } from "react";
import Modal from "react-modal";

import { useWeb3Context } from "../../context/index.js";
import { GetParams, SwitchNetwork } from "../../utils/onboard.js";
import Button from "./Button";

const OnboardModal = () => {
  const { updateWalletAddress } = useWeb3Context();
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(-1);

  async function resetParams() {
    const currentStep = await GetParams();
    setStep(currentStep.step);
    setIsOpen(currentStep.step !== -1);
  }

  useEffect(() => {
    resetParams();

    window?.ethereum?.on("chainChanged", () => {
      resetParams();
    });

    window?.ethereum?.on("accountsChanged", () => {
      resetParams();
    });
  }, []);

  const generateStep = (st: number) => {
    switch (st) {
      case 0:
        return (
          <>
            <p className="font-bold text-3xl text-white mb-6 text-center">
              You don't have Core Wallet installed!
            </p>
            <Button
              title="Download Core"
              handleClick={() => window.open("https://core.app/", "_blank")}
            />
          </>
        );

      case 1:
        return (
          <>
            <p className="font-bold text-3xl text-white mb-6 text-center">
              You haven't connected your account to Core Wallet!
            </p>
            <Button title="Connect Account" handleClick={updateWalletAddress} />
          </>
        );

      case 2:
        return (
          <>
            <p className="font-bold text-3xl text-white mb-6 text-center">
              You're on a different network. Switch to Binance Smart Chain (BSC).
            </p>
            <Button title="Switch" handleClick={SwitchNetwork} />
          </>
        );

      case 3:
        return (
          <>
            <p className="font-bold text-3xl text-white mb-6 text-center">
              Oops, you don't have BNB tokens in your account
            </p>
            <Button
              title="Grab some test tokens"
              handleClick={() =>
                window.open("https://faucet.avax.network/", "_blank")
              }
            />
          </>
        );

      default:
        return (
          <p className="font-bold text-3xl text-white mb-6 text-center">
            Good to go!
          </p>
        );
    }
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      className="absolute inset-0 flex items-center justify-center flex-col bg-white backdrop-filter backdrop-blur-lg bg-opacity-10"
      overlayClassName="Overlay"
    >
      {generateStep(step)}
    </Modal>
  );
};

export default OnboardModal;
