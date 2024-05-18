import { useState } from "react";
import {
  BanknotesIcon,
  InboxArrowDownIcon,
  MinusIcon,
  PlusIcon,
  UserGroupIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import NavItem from "./components/NavItem";
import Deposit from "./components/Tabs/Deposit";
import Transfer from "./components/Tabs/Transfer";
import AddGuardian from "./components/Tabs/AddGuardian";
import RemoveGuardian from "./components/Tabs/RemoveGuardian";
import { useWeb3Context } from "./context";
import AddToken from "./components/Tabs/AddToken";
import RemoveToken from "./components/Tabs/RemoveToken";
import ProposeOwner from "./components/Tabs/ProposeOwner";
import Error from "./components/Custom/Error";

enum Tabs {
  DEPOSIT,
  TRANSFER,
  ADD_GUARDIAN,
  REMOVE_GUARDIAN,
  PROPOSE_OWNER,
  ADD_TOKEN,
  REMOVE_TOKEN,
}

interface TabsParameters {
  icon: JSX.Element;
  title: string;
  tab: Tabs;
  disabled: boolean;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.TRANSFER);
  const [showHash, setShowHash] = useState<boolean>(false);
  const { isGuardian, isOwner } = useWeb3Context();

  const tabs: TabsParameters[] = [
    {
      icon: <InboxArrowDownIcon style={{ height: 20, width: 20 }} />,
      title: "Deposit",
      tab: Tabs.DEPOSIT,
      disabled: false,
    },
    {
      icon: <BanknotesIcon style={{ height: 20, width: 20 }} />,
      title: "Transfer",
      tab: Tabs.TRANSFER,
      disabled: false,
    },
    {
      icon: <PlusIcon style={{ height: 20, width: 20 }} />,
      title: "Add New Token",
      tab: Tabs.ADD_TOKEN,
      disabled: !isGuardian && !isOwner,
    },
    {
      icon: <MinusIcon style={{ height: 20, width: 20 }} />,
      title: "Remove Token",
      tab: Tabs.REMOVE_TOKEN,
      disabled: !isGuardian && !isOwner,
    },
    {
      icon: <UserGroupIcon style={{ height: 20, width: 20 }} />,
      title: "Propose New Owner",
      tab: Tabs.PROPOSE_OWNER,
      disabled: !isGuardian && !isOwner,
    },
    {
      icon: <UserPlusIcon style={{ height: 20, width: 20 }} />,
      title: "Add Guardian",
      tab: Tabs.ADD_GUARDIAN,
      disabled: !isOwner,
    },
    {
      icon: <UserMinusIcon style={{ height: 20, width: 20 }} />,
      title: "Remove Guardian",
      tab: Tabs.REMOVE_GUARDIAN,
      disabled: !isOwner,
    },
  ];

  return (
    <div className="flex h-screen items-center justify-center">
      <Error />
      <div className="max-w-3xl w-full h-1/2 bg-gray-800 rounded-2xl md:border border-y border-gray-600">
        <div className="h-full md:flex md:flex-row p-6">
          {/* Navbar */}
          <div className="md:w-1/3 md:border-r border-r-gray-600 md:pr-8 overflow-y-scroll">
            <h1>Tools</h1>
            {tabs.map((t, i) => (
              <NavItem
                key={i}
                icon={t.icon}
                title={t.title}
                active={activeTab === t.tab}
                onClick={() => setActiveTab(t.tab)}
                disabled={t.disabled}
              />
            ))}
          </div>
          <div className="border-t border-t-gray-600 md:border-0 pt-4 md:pl-8 md:w-2/3">
            {activeTab === Tabs.TRANSFER && (
              <Transfer showHash={showHash} setShowHashes={setShowHash} />
            )}
            {activeTab === Tabs.DEPOSIT && (
              <Deposit showHash={showHash} setShowHashes={setShowHash} />
            )}
            {activeTab === Tabs.ADD_GUARDIAN && <AddGuardian />}
            {activeTab === Tabs.REMOVE_GUARDIAN && <RemoveGuardian />}
            {activeTab === Tabs.ADD_TOKEN && <AddToken />}
            {activeTab === Tabs.REMOVE_TOKEN && <RemoveToken />}
            {activeTab === Tabs.PROPOSE_OWNER && <ProposeOwner />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
