import { useCombobox } from 'downshift';
import { useState, useEffect } from 'react';

const AutoCompleteSearch = (props) => {

    const customers = props.customers; //We will have passed this to the DropdownCombobox component through props so we don't have to wait for useSelector to load, preventing complications
    const [inputItems, setInputItems] = useState(customers);

    const {
      isOpen,
      getToggleButtonProps,
      getLabelProps,
      getMenuProps,
      getInputProps,
      highlightedIndex,
      getItemProps,
    } = useCombobox({
      items: inputItems,
      onInputValueChange: ({inputValue}) => {
        setInputItems(
          customers.filter((item) =>
            item.toLowerCase().startsWith(inputValue.toLowerCase()),
          ),
        )
      },
    })
    return (
      <div>
        <label {...getLabelProps()}>{props.title}:</label>
        <div id="comboboxStyles">
          <input {...getInputProps()} />
          <button
            type="button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
          >
            &#8595;
          </button>
        </div>
        <ul {...getMenuProps()} id="menuStyles">
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                style={
                  highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
                }
                key={`${item}${index}`}
                {...getItemProps({item, index})}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    )
  }

export default AutoCompleteSearch;