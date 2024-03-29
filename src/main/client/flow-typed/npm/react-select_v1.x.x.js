// flow-typed signature: 4d627c4c88540aabad9b310634e9012d
// flow-typed version: c6154227d1/react-select_v1.x.x/flow_>=v0.104.x

declare module 'react-select' {
  declare type OptionType = { [string]: any, ... };
  declare type OptionsType = OptionType[];

  declare type Props = {|
    // html id(s) of element(s) that should be used to describe this input (for assistive tech)
    'aria-describedby'?: string,
    // aria label (for assistive tech)
    'aria-label'?: string,
    // html id of an element that should be used as the label (for assistive tech)
    'aria-labelledby'?: string,
    // placeholder displayed when you want to add a label on a multi-value input
    addLabelText?: string,
    // Create drop-down caret element
    arrowRenderer?: React$ComponentType<{ onMouseDown?: SyntheticMouseEvent<*>, ... }>,
    // automatically blur the component when an option is selected
    autoBlur?: boolean,
    // autoFocus the component on mount, autofocus deprecated; use autoFocus instead
    autoFocus?: boolean,
    // whether to enable autosizing or not
    autosize?: boolean,
    // whether backspace removes an item if there is no text input
    backspaceRemoves?: boolean,
    // Message to use for screenreaders to press backspace to remove the current item - {label} is replaced with the item label
    backspaceToRemoveMessage?: string,
    // className for the outer element
    className?: string,
    // title for the "clear" control when multi: true
    clearAllText?: string | React$Element<*>,
    // create clearable x element
    clearRenderer?: React$ComponentType<{...}>,
    // title for the "clear" control
    clearValueText?: string | React$Element<*>,
    // should it be possible to reset value
    clearable?: boolean,
    // whether to close the menu when a value is selected
    closeOnSelect?: boolean,
    // whether backspace removes an item if there is no text input
    deleteRemoves?: boolean,
    // delimiter to use to join multiple values for the hidden field value
    delimiter?: string,
    // whether the Select is disabled or not
    disabled?: boolean,
    // whether escape clears the value when the menu is closed
    escapeClearsValue?: boolean,
    // method to filter a single option (option, filterString)
    filterOption?: (option: OptionType, filterString: string) => boolean,
    // boolean to enable default filtering or function to filter the options array ([options], filterString, [values])
    filterOptions?: | boolean
      | ((
          options: OptionsType,
          filterValue: string,
          excludeOptions: Array<{...}>,
          props: {...}
        ) => OptionsType),
    // html id to set on the input element for accessibility or tests
    id?: string,
    // whether to strip diacritics when filtering
    ignoreAccents?: boolean,
    // whether to perform case-insensitive filtering
    ignoreCase?: boolean,
    // custom attributes for the Input
    inputProps?: {...},
    // returns a custom input component
    inputRenderer?: React$ComponentType<{...}>,
    // set the components instanceId
    instanceId?: string,
    // whether the Select is loading externally or not (such as options being loaded)
    isLoading?: boolean,
    // joins multiple values into a single form field with the delimiter (legacy mode)
    joinValues?: boolean,
    // path of the label value in option objects
    labelKey?: string,
    // (any|start) match the start or entire string when filtering
    matchPos?: 'any' | 'start',
    // (any|label|value) which option property to filter on
    matchProp?: 'any' | 'label' | 'value',
    // optional buffer (in px) between the bottom of the viewport and the bottom of the menu
    menuBuffer?: number,
    // optional style to apply to the menu container
    menuContainerStyle?: {...},
    // renders a custom menu with options
    menuRenderer?: React$ComponentType<{...}>,
    // optional style to apply to the menu
    menuStyle?: {...},
    // multi-value input
    multi?: boolean,
    // generates a hidden <input /> tag with this field name for html forms
    name?: string,
    // placeholder displayed when there are no matching search results
    noResultsText?: string | React$Element<*>,
    // onBlur handler: function (event) {}
    onBlur?: (event: SyntheticFocusEvent<*>) => void,
    // whether input is cleared on blur
    onBlurResetsInput?: boolean,
    // onChange handler: function (newValue) {}
    onChange?: (value: any) => void,
    // fires when the menu is closed
    onClose?: () => void,
    // whether input is cleared when menu is closed through the arrow
    onCloseResetsInput?: boolean,
    // onFocus handler: function (event) {}
    onFocus?: (event: SyntheticFocusEvent<*>) => void,
    // onInputChange handler: function (inputValue) {}
    onInputChange?: (value: any) => any,
    // input keyDown handler: function (event) {}
    onInputKeyDown?: (event: SyntheticKeyboardEvent<*>) => void,
    // fires when the menu is scrolled to the bottom; can be used to paginate options
    onMenuScrollToBottom?: () => void,
    // fires when the menu is opened
    onOpen?: () => void,
    // whether input is cleared on select (works only for multiselect)
    onSelectResetsInput?: boolean,
    // onClick handler for value labels: function (value, event) {}
    onValueClick?: (value: string, event: Event) => void,
    // boolean to enable opening dropdown when focused
    openAfterFocus?: boolean,
    // boolean to control opening the menu when the control is clicked
    openOnClick?: boolean,
    // always open options menu on focus
    openOnFocus?: boolean,
    // additional class(es) to apply to the <Option /> elements
    optionClassName?: string,
    // option component to render in dropdown
    optionComponent?: React$ComponentType<{...}>,
    // optionRenderer: function (option) {}
    optionRenderer?: (
      option: OptionType,
      idx: number,
      inputValue: any
    ) => React$Node,
    // array of options
    options?: OptionsType,
    // number of entries to page when using page up/down keys
    pageSize?: number,
    // field placeholder, displayed when there's no value
    placeholder?: string | React$Element<*>,
    // whether the selected option is removed from the dropdown on multi selects
    removeSelected?: boolean,
    // applies HTML5 required attribute when needed
    required?: boolean,
    // value to use when you clear the control
    resetValue?: any,
    // set to true in order to use react-select in right-to-left direction
    rtl?: boolean,
    // boolean to enable the viewport to shift so that the full menu fully visible when engaged
    scrollMenuIntoView?: boolean,
    // whether to enable searching feature or not
    searchable?: boolean,
    // pass the value to onChange as a simple value (legacy pre 1.0 mode), defaults to false
    simpleValue?: boolean,
    // optional style to apply to the control
    style?: {...},
    // optional tab index of the control
    tabIndex?: number,
    // whether to treat tabbing out while focused to be value selection
    tabSelectsValue?: boolean,
    // whether to trim whitespace around filter value
    trimFilter?: boolean,
    // initial field value
    value?: any,
    // value component to render
    valueComponent?: React$ComponentType<{...}>,
    // path of the label value in option objects
    valueKey?: string,
    // valueRenderer: function (option) {}
    valueRenderer?: (option: OptionType, idx?: number) => React$Node,
    // optional style to apply to the component wrapper
    wrapperStyle?: {...},
    isSearchable?: boolean
  |};

  declare type AsyncProps = {|
    /* The default set of options to show before the user starts searching. When
     set to `true`, the results for loadOptions('') will be autoloaded. */
    defaultOptions?: OptionsType | boolean,
    /* Function that returns a promise, which is the set of options to be used
     once the promise resolves. */
    loadOptions: (string, (OptionsType) => void) => Promise<*> | void,
    /* If cacheOptions is truthy, then the loaded data will be cached. The cache
     will remain until `cacheOptions` changes value. */
    cacheOptions?: any
  |};

  declare export default class Select extends React$Component<Props> {}
  declare export class Async extends React$Component<{|
    ...Props,
    ...AsyncProps
  |}> {}
}
