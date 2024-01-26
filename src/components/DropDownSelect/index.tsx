import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.scss";
import cn from "classnames";
import useClickOutside from "../../hooks/useClickOutside";

type option = {
  value: string;
  text: string;
};

interface Props {
  options: option[];
  onChange: (v: string) => void;
  onAddNewItem: (v: string) => void;
}

export default function DropDownSelect({
  options,
  onChange,
  onAddNewItem,
}: Props) {
  const [dropDown, setDropDown] = useState(false);
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState("");
  const [preSelect, setPreSelect] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const optionsRefs = useRef<(HTMLDivElement | null)[]>([]);

  useClickOutside(selectBoxRef, () => {
    setDropDown(false);
  });

  useEffect(() => {
    if (value)
      scrollToItem(filteredOptions.findIndex((op) => op.value === value));
  }, [dropDown]);

  const filteredOptions = useMemo(() => {
    if (value === selected) return options;
    return options.filter((option) =>
      option.text.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, options, selected]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    let next;
    switch (event.key) {
      case "Enter":
        onEnterPress();
        break;
      case "ArrowDown":
        next = preSelect >= filteredOptions.length ? 1 : preSelect + 1;
        setPreSelect(next);
        scrollToItem(next);
        break;
      case "ArrowUp":
        next = preSelect <= 1 ? filteredOptions.length : preSelect - 1;
        setPreSelect(next);
        scrollToItem(next);
        break;
      default:
        break;
    }
  };

  const onEnterPress = () => {
    const findItem = preSelect
      ? filteredOptions.find((el, index) => {
          if (index + 1 === preSelect) return el;
        })
      : options.find(
          (option) => option.text.toLowerCase() === value.toLowerCase()
        );

    if (!findItem) onAddNewItem(value);
    onSelect(findItem?.value || value);
  };

  const scrollToItem = (nextItem: number) => {
    optionsRefs.current[nextItem - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const onSelect = (selected: string) => {
    setSelected(selected);
    setValue(selected);
    onChange(selected);
    setDropDown(false);
    inputRef.current?.blur();

    const selectedIndex = options.findIndex((el) => el.value === selected);
    setPreSelect(selectedIndex ? selectedIndex + 1 : 1);
  };

  return (
    <div className={styles.dropDownSelect} ref={selectBoxRef}>
      <input
        type="text"
        placeholder="Select an item or write your own"
        value={value}
        ref={inputRef}
        onKeyDown={onKeyDown}
        onFocus={() => setDropDown(true)}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
      {dropDown && (
        <div className={styles.dropDown}>
          {filteredOptions.map((option, index) => (
            <div
              ref={(ref) => (optionsRefs.current[index] = ref)}
              key={option.value}
              className={cn(styles.dropDownItem, {
                [styles.dropDownItemActive]: selected === option.value,
                [styles.dropDownItemPreSelect]: preSelect === index + 1,
              })}
              onClick={() => onSelect(option.value)}
            >
              {option.text}
              {selected === option.value && <div>&#10003;</div>}
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className={styles.dropDownItem}>
              &#43; Press enter to add this item
            </div>
          )}
        </div>
      )}
    </div>
  );
}
