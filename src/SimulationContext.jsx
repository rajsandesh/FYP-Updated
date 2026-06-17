import React, { createContext, useContext, useState, useEffect } from "react";

const SimulationContext = createContext(null);

export function SimulationProvider({ children }) {
  const [tick, setTick] = useState(0);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isDefending, setIsDefending] = useState(false);
  const [networkState, setNetworkState] = useState({
    safe: ["n1", "n3", "n4"],
    atRisk: ["n2"],
    infiltrated: [],
  });
  const [attackerFocus, setAttackerFocus] = useState("n2");
  const [defenderFocus, setDefenderFocus] = useState("n1");
  const [qTable, setQTable] = useState(Array.from({ length: 16 }, () => Math.random()));
  const [attackerReward, setAttackerReward] = useState([{ time: 0, reward: 10 }]);
  const [attackerLogs, setAttackerLogs] = useState(["[RED_AGENT] initialized. Awaiting target acquisition."]);
  const [defenderLogs, setDefenderLogs] = useState(["[BLUE_AGENT] online. Perimeter secured."]);

  // Main RL Simulation Loop
  useEffect(() => {
    let tickInterval;
    let attackInterval;
    let defenseInterval;

    if (isAttacking || isDefending) {
      tickInterval = setInterval(() => {
        setTick((t) => t + 1);
      }, 1000);
    }

    if (isAttacking) {
      attackInterval = setInterval(() => {
        const nodes = ["n1", "n2", "n3", "n4"];
        const newAttackerFocus = nodes[Math.floor(Math.random() * nodes.length)];
        setAttackerFocus(newAttackerFocus);

        setQTable((prev) => prev.map((q) => Math.max(0, Math.min(1, q + (Math.random() - 0.5) * 0.1))));

        setAttackerReward((prev) => {
          const newReward = [...prev, { time: tick + 1, reward: Math.max(0, prev[prev.length - 1].reward + (Math.random() * 10 - 4)) }];
          if (newReward.length > 20) newReward.shift();
          return newReward;
        });

        if (Math.random() > 0.4) {
          setAttackerLogs((prev) => [`[RED_AGENT] exploring ${newAttackerFocus}; ${(Math.random() * 100).toFixed(1)}% success probability calculated.`, ...prev].slice(0, 10));
        }
      }, 1000);
    }

    if (isDefending) {
      defenseInterval = setInterval(() => {
        const nodes = ["n1", "n2", "n3", "n4"];
        const newDefenderFocus = nodes[Math.floor(Math.random() * nodes.length)];
        setDefenderFocus(newDefenderFocus);

        if (Math.random() > 0.4) {
          setDefenderLogs((prev) => [`[BLUE_AGENT] updated policy: Reinforcing ${newDefenderFocus} due to elevated threat profile.`, ...prev].slice(0, 10));
        }
      }, 1000);
    }

    return () => {
      clearInterval(tickInterval);
      clearInterval(attackInterval);
      clearInterval(defenseInterval);
    };
  }, [isAttacking, isDefending, tick]);

  const value = {
    tick,
    isAttacking,
    setIsAttacking,
    isDefending,
    setIsDefending,
    networkState,
    attackerFocus,
    defenderFocus,
    qTable,
    attackerReward,
    attackerLogs,
    defenderLogs,
  };

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) throw new Error("useSimulation must be used within a SimulationProvider");
  return context;
}
