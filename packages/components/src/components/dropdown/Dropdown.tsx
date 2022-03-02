import * as React from 'react';
import { CSSProperties } from 'react';
import Select, { ActionMeta, createFilter } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';

import {
  ClearIndicator,
  Control,
  DefaultOptionRenderer,
  DefaultTagRenderer,
  DropdownIndicator,
  Input,
  MultiValueContainerOverride,
  SingleValue,
  NoOptionsMessage,
  DropdownList,
  LoadingMessage,
  firstOption
} from './CustomRender';
import {
  DropdownOption,
  DropdownState,
  DropdownProps,
  LabelValue,
} from './interfaces';
import LabelTooltipDecorator from '../label-tooltip-decorator/LabelTooltipDecorator';
import classNames from 'classnames';

// css baseclass prefix
const prefix = 'tk-select';

export class Dropdown<T = LabelValue> extends React.Component<
  DropdownProps<T>,
  DropdownState<T>
> {
  myRef: any;
  searchHeaderOption: any;
  lastSelectedOption: any;

  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.searchHeaderOption = { ...firstOption };

    const {
      asyncOptions,
      isCreatable,
      isMultiSelect,
      hideSelectedOptions,
      closeMenuOnSelect,
      displayArrowIndicator,
    } = this.props;

    let DropdownTag: any = Select;
    if (asyncOptions && !isCreatable) {
      DropdownTag = AsyncSelect;
    } else if (asyncOptions && isCreatable) {
      DropdownTag = AsyncCreatableSelect;
    } else if (!asyncOptions && isCreatable) {
      DropdownTag = CreatableSelect;
    }

    this.state = {
      DropdownTag,
      selectedOption: null,
      hideSelectedOptions: hideSelectedOptions || isMultiSelect,
      closeMenuOnSelect: closeMenuOnSelect || !isMultiSelect,
      displayArrowIndicator: displayArrowIndicator || !isMultiSelect,
    };
  }

  componentDidMount() {
    const { onInit, value } = this.props;
    if (onInit && value) {
      onInit(value as any);
    }
  }

  render() {
    const {
      hideSelectedOptions,
      closeMenuOnSelect,
      displayArrowIndicator,
      DropdownTag,
    } = this.state;

    const {
      asyncOptions,
      autoScrollToCurrent,
      bindLabel,
      bindValue,
      blurInputOnSelect,
      className,
      defaultOptions,
      defaultValue,
      enableTermSearch,
      filterFunction,
      iconName,
      id,
      inputAlwaysDisplayed,
      inputValue,
      isDisabled,
      isInputClearable,
      isMultiSelect,
      isOptionDisabled,
      isOptionSelected,
      isTypeAheadEnabled,
      label,
      maxHeight,
      maxMenuHeight,
      menuIsOpen,
      menuPlacement,
      menuPortalStyles,
      menuPortalTarget,
      menuShouldBlockScroll,
      menuShouldScrollIntoView,
      mode,
      name,
      noOptionMessage,
      placeHolder,
      helperText,
      onBlur,
      onChange,
      onClear,
      onCopy,
      onCut,
      onDrag,
      onFocus,
      onInputChange,
      onKeyDown,
      onKeyUp,
      onMenuOpen,
      onMenuClose,
      onTermSearch,
      optionRenderer,
      options,
      showRequired,
      size,
      tabSelectsValue,
      tagRenderer,
      termSearchMessage,
      tooltip,
      tooltipCloseLabel,
      value,
      variant,
      ...otherProps
    } = this.props;

    const handleChange = (selectedOption, meta: ActionMeta<T>) => {
      const isClearingTermSearch =
        this.lastSelectedOption === this.searchHeaderOption && !selectedOption;
      this.lastSelectedOption = selectedOption;
      if (
        onChange &&
        !selectedOption?.searchHeader &&
        !isClearingTermSearch
      ) {
        onChange({ target: { value: selectedOption } });
      }
      if (onTermSearch && selectedOption?.searchHeader) {
        onTermSearch(selectedOption);
      }
      if (meta.action === 'clear' && onClear) {
        onClear();
      }
    };

    const handleBlur = () => {
      const { value } = this.props;
      if (onBlur) {
        onBlur({ target: { value: value as any } });
      }
    };

    const internalFiltering = filterFunction
      ? (o, input) => filterFunction(o.data, input)
      : createFilter(null);

    const filter = (o, input) => {
      return o.data.searchHeader || internalFiltering(o, input);
    };

    const handleIsOptionDisabled = isOptionDisabled
      ? (option: T) => isOptionDisabled(option)
      : undefined;

    const handleIsOptionSelected = isOptionSelected
      ? (option: T) => isOptionSelected(option)
      : (option: DropdownOption<T>, selectValue: T[]) => selectValue?.some(i => i === option);

    const internalOptions = options
      ? enableTermSearch
        ? [this.searchHeaderOption as T, ...options]
        : options
      : undefined;


    const internalAsyncOptions = async (inputValue: string) => asyncOptions(inputValue)
      .then(options => new Promise(resolve =>
        resolve(enableTermSearch ?
          [this.searchHeaderOption as T, ...options]
          : options))
      );

    const effectiveBindValue = bindValue
      ? (option) => option[bindValue]
      : undefined;

    return (
      <div className={classNames(className, 'tk-input-group', `tk-input-group--${size}`)}>
        <DropdownTag
          styles={{
            menuPortal: (base: CSSProperties) => ({ ...base, ...menuPortalStyles }),
            valueContainer: (base: CSSProperties) => ({
              ...base, maxHeight: `${maxHeight}px`
            }),
            input: (base: CSSProperties) => ({ ...base, margin: (size === 'small') ? '0 2px' : undefined, color: 'inherit' }),
            multiValue: (base: CSSProperties) => ({ ...base, margin: '0' })
          }}
          parentInstance={this}
          ref={this.myRef}
          selectRef={this.myRef}
          displayArrowIndicator={displayArrowIndicator}
          optionRenderer={optionRenderer}
          tagRenderer={tagRenderer}
          isClearable={isInputClearable}
          components={{
            DropdownIndicator,
            Control,
            SingleValue,
            Input,
            Option: DefaultOptionRenderer,
            MultiValueContainer: MultiValueContainerOverride,
            MultiValue: DefaultTagRenderer,
            ClearIndicator,
            MultiValueRemove: () => null,
            NoOptionsMessage,
            MenuList: DropdownList,
            LoadingIndicator: () => null,
            LoadingMessage
          }}
          defaultValue={defaultValue}
          id={id}
          name={name}
          className={classNames(prefix, { [`${prefix}--${variant}`]: variant }, { [`${prefix}--${size}`]: size })}
          closeMenuOnSelect={closeMenuOnSelect}
          classNamePrefix={prefix}
          value={value}
          inputValue={inputValue}
          inputAlwaysDisplayed={inputAlwaysDisplayed}
          onChange={handleChange}
          onBlur={handleBlur}
          onCopy={onCopy}
          onCut={onCut}
          onDrag={onDrag}
          onFocus={onFocus}
          onInputChange={onInputChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          options={internalOptions}
          loadOptions={internalAsyncOptions}
          defaultOptions={defaultOptions !== undefined ? defaultOptions : true}
          hideSelectedOptions={hideSelectedOptions}
          placeholder={placeHolder}
          isMulti={isMultiSelect}
          isDisabled={isDisabled}
          iconName={iconName}
          noOptionMessage={noOptionMessage}
          filterOption={filter}
          isSearchable={isTypeAheadEnabled}
          isOptionDisabled={handleIsOptionDisabled}
          isOptionSelected={handleIsOptionSelected}
          menuPlacement={menuPlacement}
          maxMenuHeight={maxMenuHeight}
          mode={mode ? mode : 'aligned'}
          autoScrollToCurrent={autoScrollToCurrent}
          menuIsOpen={menuIsOpen}
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          tabSelectsValue={tabSelectsValue}
          enableTermSearch={enableTermSearch}
          termSearchMessage={termSearchMessage}
          getOptionValue={effectiveBindValue}
          getOptionLabel={bindLabel}
          blurInputOnSelect={blurInputOnSelect}
          menuPortalTarget={menuPortalTarget}
          menuShouldBlockScroll={menuShouldBlockScroll}
          menuShouldScrollIntoView={menuShouldScrollIntoView}
          {...otherProps}
        />
        <LabelTooltipDecorator
          htmlFor={id}
          label={label}
          placement={'top'}
          tooltip={tooltip}
          tooltipCloseLabel={tooltipCloseLabel}
          showRequired={showRequired}
        />
        {helperText && <div className="tk-input__helper">{helperText}</div>}
      </div>
    );
  }

  static defaultProps = {
    isDisabled: false,
    isMultiSelect: false,
    isCreatable: false,
    isInputClearable: false,
    isTypeAheadEnabled: true,
    autoScrollToCurrent: false,
    enableTermSearch: false,
    menuPlacement: 'auto',
    menuPortalStyles: {},
    menuShouldBlockScroll: false,
    menuShouldScrollIntoView: true,
    size: 'medium',
    bindLabel: (option) => option?.label,
  };
}

export default Dropdown;
