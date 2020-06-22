import React, { Component } from 'react';
import { DatePicker, Icon, Popover } from '@shopify/polaris';
import classNames from 'classnames';
import { CaretDownMinor } from '@shopify/polaris-icons';
import moment from 'moment';
import './DateInput.scss';

class DateInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      month: parseInt(moment().format('M'), 10) - 1,
      year: parseInt(moment().format('YYYY'), 10),
    };
    this._Ref = React.createRef();
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
    const { active, month, year } = this.state;
    const { input, className, dateProps, eventName } = this.props;

    const activator = (
      <div className={classNames('DateInput-Input', { active: this.state.active })} onClick={this.togglePopover}>
        <div className={classNames('Polaris-Select__SelectedOption')}>
          {input && input.value && input.value ? moment(input.value).format('MMM D, YYYY') : '' }
        </div>
        <Icon color="inkLighter" source={CaretDownMinor} />
      </div>
    );

    return (
      <div className={classNames('DateInput', className)}>
        <Popover
          active={active}
          activator={activator}
          onClose={() => {
            this.setState({ active: false });
          }}
          preferredAlignment="left"
        >
          <div className="date-content">
            <DatePicker
              month={month}
              year={year}
              onChange={(value) => {
                input.onChange(moment(value.start).format('YYYY-MM-DD'));
                this.setState({ active: false });
                if(eventName){
                  amplitude.logEvent(eventName,{value: moment(value.start).format('YYYY-MM-DD')});
                }
              }}
              onMonthChange={(month_tmp, year_tmp) => {
                this.setState({
                  month: month_tmp,
                  year: year_tmp,
                });
              }}
              selected={{
                start: moment(input.value).toDate(),
                end: moment(input.value).toDate(),
              }}
              {...dateProps}
            />
          </div>
        </Popover>
      </div>
    );
  }
}

export default DateInput;
