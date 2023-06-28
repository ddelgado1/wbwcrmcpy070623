import { useCombobox } from 'downshift';
import { useState } from 'react';

const AutoCompleteSearch = (props) => {

    const customers = props.customers; //We will have passed this to the DropdownCombobox component through props so we don't have to wait for useSelector to load, preventing complications
    const [inputItems, setInputItems] = useState([...new Set(customers)]);

    const {
      isOpen,
      getLabelProps,
      getMenuProps,
      getInputProps,
      selectedItem,
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
        props.setCustomer(oldState => ({...oldState, [props.key_name]: inputValue}))
      },
    })
    return (
      <div>
        <label {...getLabelProps()}>{props.title}:</label>
        <div id="comboboxStyles" className='autocomplete'>
          <input {...getInputProps()} className='autocomplete__input' />
          
          {/* <button
            type="button"
            className="downshift-toggle-button"
            {...getToggleButtonProps()}
            aria-label="toggle menu"
          >
            {'Select an option'}
          </button> */}
        </div>
        <ul {...getMenuProps()} id="menuStyles" className={`autocomplete__menu ${isOpen ? 'open' : ''}`}>
          {isOpen &&
            inputItems.map((item, index) => (
              <li
                key={`${item}${index}`}
                {...getItemProps({item, index})}
                className={`autocomplete__item ${
                  highlightedIndex === index ? 'downshift-highlighted-item' : ''
                } ${
                  selectedItem === item ? 'downshift-selected-item' : ''
                }`}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    )
  }

export default AutoCompleteSearch;