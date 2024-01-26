import { useState } from "react";
import styles from "./App.module.scss";
import DropDownSelect from "./components/DropDownSelect";

export default function App() {
  const [options, setOptions] = useState([
    { value: "Art", text: "Art" },
    { value: "Sport", text: "Sport" },
    { value: "Science", text: "Science" },
    { value: "Movie", text: "Movie" },
    { value: "Game", text: "Game" },
    { value: "Magic", text: "Magic" },
    { value: "Tools", text: "Tools" },
    { value: "Picnic", text: "Picnic" },
    { value: "Lock", text: "Lock" },
    { value: "Fight", text: "Fight" },
  ]);

  const addNewOption = (value: string) => {
    setOptions((options) => [{ value, text: value }, ...options]);
  };

  return (
    <div className={styles.wrapper}>
      <DropDownSelect
        options={options}
        onAddNewItem={addNewOption}
        onChange={(v) => console.log("you select", v)}
      />
    </div>
  );
}
