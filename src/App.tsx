import { useEffect, useState } from "react";
import "./App.css";
import { Table } from "./components/Table";

type Character = {
  id: string;
  name: string;
  location: string;
  health: string;
  power: number;
  viewed?: boolean;
  selected?: boolean;
};

const columns = [
  { key: "selected" as const, header: " " },
  { key: "name" as const, header: "Name" },
  { key: "location" as const, header: "Location" },
  { key: "health" as const, header: "Health" },
  { key: "power" as const, header: "Power" },
];

function App() {
  const [charData, setCharData] = useState<Character[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/characters");
      const data = await response.json();
      setCharData(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Table<Character> columns={columns} data={charData} />
    </>
  );
}

export default App;
