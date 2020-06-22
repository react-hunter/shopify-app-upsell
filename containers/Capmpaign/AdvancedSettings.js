import React, { Component } from 'react';
import { Heading, Stack, RadioButton, Label } from '@shopify/polaris';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { formValueSelector, Field } from 'redux-form';
import moment from 'moment';
import './AdvancedSettings.scss';
import CheckboxInput from '../../components/Fields/CheckboxInput';
import DateInput from '../../components/Fields/DateInput';
import QuestionMark from '../../components/QuestionMark';


class AdvancedSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (value, id) => {
    const { change } = this.props;
    change('show_campaign_only', id);
    amplitude.logEvent('click-campaign_show_campaign_on_platforms',{value: id});
  };

  render() {
    const { show_campaign_only, page_to_show, start_time, end_time, start_date_value, end_date_value, change } = this.props;

    if (moment(start_date_value) >= moment(end_date_value)) {
      change('end_date_value', moment(start_date_value).format('YYYY-MM-DD'));
    }

    const skip_offers_already_icluded_label = page_to_show=='cart_page' ? 'Skip offers if the product is already included in the cart' : 'Skip offers if the product is already included in the original order';

    return (
      <div className="AdvancedSettings">
        <Heading>{I18n.t('Advanced settings')}</Heading>
        <p className="margin-bottom">{I18n.t('Set optional rules for this campaign')}</p>
        <Label>{I18n.t('Show this campaign only on')}</Label>
        <div className="margin-bottom">
          <Stack>
            <RadioButton
              label="Both"
              checked={show_campaign_only === 'both'}
              id="both"
              onChange={this.handleChange}
            />
            <RadioButton
              label="Mobile"
              checked={show_campaign_only === 'mobile'}
              id="mobile"
              onChange={this.handleChange}
            />
            <RadioButton
              label="Desktop"
              checked={show_campaign_only === 'desktop'}
              id="desktop"
              onChange={this.handleChange}
            />
          </Stack>
        </div>
        <Field
          name="skip_offers_already_icluded"
          component={CheckboxInput}
          className="margin-bottom"
          label={I18n.t(skip_offers_already_icluded_label)}
          eventName='click-campaign_skip_offers_already_icluded'
        />
        {page_to_show != 'cart_page' && <div style={{ display: 'flex' }}>
          <Field
            name="show_this_funnel_once"
            component={CheckboxInput}
            className="margin-bottom"
            label={I18n.t('Show this funnel once')}
            eventName='click-campaign_show_this_funnel_once'
          />
          <QuestionMark style={{ marginLeft: '1rem' }} content={I18n.t('Check this box if you want to show this funnel once per buyer')} />
        </div>}
        
        <div className="margin-bottom">
          <Label>{I18n.t('Campaign start and end time')}</Label>
        </div>
        <Field
          name="start_time"
          component={CheckboxInput}
          className="margin-bottom"
          label={I18n.t('Set start time')}
          eventName='click-campaign_start_time'
        />
        {start_time ? (
          <Field
            name="start_date_value"
            component={DateInput}
            className="margin-bottom"
            label={I18n.t('Set start time')}
            dateProps={{
              disableDatesBefore: moment().add(-1, 'days').toDate(),
            }}
            eventName='click-campaign_select_start_time'
          />
        ) : null}
        <Field
          name="end_time"
          component={CheckboxInput}
          className="margin-bottom"
          label={I18n.t('Set end time')}
          eventName='click-campaign_end_time'
        />
        {end_time ? (
          <Field
            name="end_date_value"
            component={DateInput}
            className="margin-bottom"
            label={I18n.t('Set start time')}
            dateProps={{
              disableDatesBefore: start_time ? moment(start_date_value).toDate() : moment().add(-1, 'days').toDate(),
            }}
            eventName='click-campaign_select_end_time'
          />
         ) : null}
      </div>
    );
  }
}

const selector = formValueSelector('campaign');

const mapStateToProps = (state) => ({
  page_to_show: selector(state, 'page_to_show'),
  show_campaign_only: selector(state, 'show_campaign_only'),
  start_time: selector(state, 'start_time'),
  end_time: selector(state, 'end_time'),
  end_date_value: selector(state, 'end_date_value'),
  start_date_value: selector(state, 'start_date_value'),
});

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSettings);
