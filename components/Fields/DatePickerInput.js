import React, { Component } from 'react';
import { DatePicker, Icon, Button, TextField } from '@shopify/polaris';
import classNames from 'classnames';
import { CaretDownMinor } from '@shopify/polaris-icons';
import moment from 'moment';
import './DatePickerInput.scss';

class DatePickerInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: parseInt(moment().format("M"), 10) - 2,
      year: moment().format("YYYY"),
      active: false,
      value: this.props.input.value,
      tmp_value: {
        start: moment(this.props.input.value.start).format('YYYY-MM-DD'),
        end: moment(this.props.input.value.end).format('YYYY-MM-DD'),
      },
      error: {},
    };
    this._Ref = React.createRef();

  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.input.value,
      tmp_value: {
        start: moment(nextProps.input.value.start).format('YYYY-MM-DD'),
        end: moment(nextProps.input.value.end).format('YYYY-MM-DD'),
      },
    });
  }

  handleClick = (event) => {
    if (this._Ref && this._Ref.current.contains(event.target)) {
      return;
    }
    this.setState({ active: false });
  };

  togglePopover = () => {
    this.setState(({ active }) => {
      return { active: !active };
    });
  };

  render() {
    const { month, year, active } = this.state;
    const { input } = this.props;
    const Regex = new RegExp(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/);

    return (
      <div className="DatePickerInput" ref={this._Ref}>
        <div className={classNames("DatePickerInput-Input", { active: this.state.active })} onClick={this.togglePopover}>
          <div className={classNames("Polaris-Select__SelectedOption")}>
            {input && input.value && input.value.start ? moment(input.value.start).format('MMM D, YYYY') + ' - ' : '' }
            {input && input.value && input.value.end ? moment(input.value.end).format('MMM D, YYYY') : '' }
          </div>
          <Icon color="inkLighter" source={CaretDownMinor} />
        </div>
        {active ? (
          <div className="drop-date" >
            <div className="inputs">
              <TextField
                label="Starting"
                error={this.state.error.start}
                value={
                  this.state.tmp_value.start
                }
                onChange={(value) => {
                  if (Regex.test(value)) {
                    this.setState({
                      value: {
                        ...this.state.value,
                        start: moment(value).toDate(),
                      },
                      tmp_value: {
                        ...this.state.tmp_value,
                        start: value,
                      },
                      error: {
                        ...this.state,
                        start: undefined,
                      },
                    });
                  } else {
                    this.setState({
                      error: {
                        ...this.state,
                        start: 'Not valid',
                      },
                      tmp_value: {
                        ...this.state.tmp_value,
                        start: value,
                      },
                    });
                  }
                }}
              />
              <TextField
                label="Ending"
                value={this.state.tmp_value.end}
                onChange={(value) => {
                  if (moment(value).isValid()) {
                    this.setState({
                      value: {
                        ...this.state.value,
                        end: moment(value).toDate(),
                      },
                      tmp_value: {
                        ...this.state.tmp_value,
                        end: value,
                      },
                      error: {
                        ...this.state,
                        end: undefined,
                      },
                    });
                  } else {
                    this.setState({
                      error: {
                        ...this.state,
                        end: 'Not valid',
                      },
                      tmp_value: {
                        ...this.state.tmp_value,
                        end: value,
                      },
                    });
                  }
                }}
              />
            </div>
            <DatePicker
              month={month}
              year={year}
              onChange={(value) => {
                // if (input.onChange) {
                //   input.onChange(value);
                // }
                // this.setState({ active: false });
                this.setState({ value,
                  tmp_value: {
                    start: moment(value.start).format('YYYY-MM-DD'),
                    end: moment(value.end).format('YYYY-MM-DD'),
                  },
                });
              }}
              onMonthChange={(month, year) => {
                this.setState({
                  month,
                  year,
                });
              }}
              selected={this.state.value}
              multiMonth
              allowRange
            />
            <div className="footer">
              <Button
                onClick={() => {
                  this.setState({ active: false });
                }}
              >
                Cancel
              </Button>
              <Button
                primary
                onClick={() => {
                  if (input.onChange) {
                    input.onChange(this.state.value);
                  }
                  this.setState({ active: false });
                }}
              >
                Apply
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default DatePickerInput;
