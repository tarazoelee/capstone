'use client';
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _react = _interopRequireDefault(require("react"));
var _partial = _interopRequireDefault(require("lodash/partial"));
var _utils = require("../utils");
var _dateUtils = require("../utils/dateUtils");
var _CalendarContext = require("./CalendarContext");
var _utils2 = require("./utils");
var TableCell = /*#__PURE__*/_react.default.forwardRef(function (props, ref) {
  var _props$as = props.as,
    Component = _props$as === void 0 ? 'div' : _props$as,
    _props$classPrefix = props.classPrefix,
    classPrefix = _props$classPrefix === void 0 ? 'calendar-table' : _props$classPrefix,
    disabled = props.disabled,
    selected = props.selected,
    date = props.date,
    onSelect = props.onSelect,
    unSameMonth = props.unSameMonth,
    rangeStart = props.rangeStart,
    rangeEnd = props.rangeEnd,
    inRange = props.inRange,
    rest = (0, _objectWithoutPropertiesLoose2.default)(props, ["as", "classPrefix", "disabled", "selected", "date", "onSelect", "unSameMonth", "rangeStart", "rangeEnd", "inRange"]);
  var _useCalendarContext = (0, _CalendarContext.useCalendarContext)(),
    onMouseMove = _useCalendarContext.onMouseMove,
    cellClassName = _useCalendarContext.cellClassName,
    renderCell = _useCalendarContext.renderCell,
    overrideLocale = _useCalendarContext.locale;
  var _useClassNames = (0, _utils.useClassNames)(classPrefix),
    prefix = _useClassNames.prefix,
    merge = _useClassNames.merge;
  var _useCustom = (0, _utils.useCustom)('Calendar', overrideLocale),
    locale = _useCustom.locale,
    formatDate = _useCustom.formatDate;
  var formatStr = locale.formattedDayPattern;
  var ariaLabel = (0, _utils2.getAriaLabel)(date, formatStr, formatDate);
  var todayDate = new Date();
  var isToday = (0, _dateUtils.isSameDay)(date, todayDate);
  var classes = merge(prefix('cell', {
    'cell-un-same-month': unSameMonth,
    'cell-is-today': isToday,
    'cell-selected': selected,
    'cell-selected-start': rangeStart,
    'cell-selected-end': rangeEnd,
    'cell-in-range': !unSameMonth && inRange,
    'cell-disabled': disabled
  }), cellClassName === null || cellClassName === void 0 ? void 0 : cellClassName(date));
  return /*#__PURE__*/_react.default.createElement(Component, (0, _extends2.default)({
    ref: ref,
    role: "gridcell",
    "aria-label": ariaLabel,
    "aria-selected": selected || undefined,
    "aria-disabled": disabled || undefined,
    tabIndex: selected ? 0 : -1,
    title: isToday ? ariaLabel + " (" + (locale === null || locale === void 0 ? void 0 : locale.today) + ")" : ariaLabel,
    className: classes,
    onMouseEnter: !disabled && onMouseMove ? onMouseMove.bind(null, date) : undefined,
    onClick: onSelect ? (0, _partial.default)(onSelect, date, disabled) : undefined
  }, rest), /*#__PURE__*/_react.default.createElement("div", {
    className: prefix('cell-content')
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: prefix('cell-day')
  }, _utils.DateUtils.getDate(date)), renderCell === null || renderCell === void 0 ? void 0 : renderCell(date)));
});
TableCell.displayName = 'CalendarTableCell';
var _default = TableCell;
exports.default = _default;