import Modal from "./Modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Button from "./Button";
import { useWeb3Context } from "../../context";

const Error = () => {
  const { showError, setError } = useWeb3Context();

  return (
    <Modal visible={showError.status}>
      <div className="flex flex-col w-full rounded-xl h-96 justify-center items-center bg-gray-800 p-4">
        <div className="h-1/2 flex flex-col items-center justify-end">
          <ExclamationTriangleIcon className="w-20 h-20" color="red" />
        </div>
        <h1 className="text-xl break-all mt-4">{showError.message}</h1>
        <div className="h-1/2 flex items-end w-1/3">
          <Button
            title="OK"
            handleClick={() => {
              setError(null);
            }}
            restStyles="px-8 py-2 w-full mb-4"
          />
        </div>
      </div>
    </Modal>
  );
};

export default Error;
