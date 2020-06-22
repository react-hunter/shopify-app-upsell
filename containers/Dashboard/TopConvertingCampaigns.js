import React, { Component } from "react";
import { Card, Icon, DataTable } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import moment from "moment";
import { ConfettiMajorMonotone } from "@shopify/polaris-icons";
import DatePickerInput from "../../components/Fields/DatePickerInput";
import "./TopConvertingCampaigns.scss";
import { getTopCampaigns } from "../../redux/actions";
///
class TopConvertingCampaigns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: {
        start: moment()
          .subtract(3, "months")
          .toDate(),
        end: moment().toDate()
      },
      top_converting_campaigns: []
    };
  }

  async componentDidMount() {
    const data = await getTopCampaigns({
      date_start: moment()
        .subtract(3, "months")
        .format("YYYY-MM-DD"),
      date_finish: moment().format("YYYY-MM-DD"),
      sort: { total: -1 }
    });
    this.setState({
      top_converting_campaigns: data
    });
  }

  handleSort = async (index, direction) => {
    const sort = [
      null,
      { unique_views: direction == "descending" ? -1 : 1 },
      { conv: direction == "descending" ? -1 : 1 },
      { total: direction == "descending" ? -1 : 1 }
    ];

    const data = await getTopCampaigns({
      // date_start: moment()
      //   .subtract(3, "months")
      //   .format("YYYY-MM-DD"),
      // date_finish: moment().format("YYYY-MM-DD"),
      date_start: this.state.date.start ? moment(this.state.date.start).format("YYYY-MM-DD") : moment()
      .subtract(3, "months")
      .format("YYYY-MM-DD"),
      date_finish:this.state.date.end ? moment(this.state.date.end).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
      sort: sort[index]
    });
    this.setState({
      top_converting_campaigns: data
    });
  };

  render() {
    const { top_converting_campaigns, date } = this.state;
    const { default_money_format } = this.props;
    return (
      <Card
        title={
          <div className="Icon-card-title Polaris-Heading">
            <Icon source={ConfettiMajorMonotone} color="inkLighter" />{" "}
            {I18n.t("Top converting campaigns")}
          </div>
        }
        sectioned
      >
        <div className="TopConvertingCampaigns-content">
          <div className="header">
            <h2>{I18n.t("See which offers generated the most revenue")}</h2>
            <div className="date">
              <DatePickerInput
                input={{
                  value: date,
                  onChange: async value => {
                    this.setState({
                      date: value,
                      top_converting_campaigns: await getTopCampaigns({
                        date_start: moment(value.start).format("YYYY-MM-DD"),
                        date_finish: moment(value.end).format("YYYY-MM-DD")
                      })
                    });
                    amplitude.logEvent(
                      "click-date_picker_top_converting_funnels",
                      {
                        date_start: moment(value.start).format("YYYY-MM-DD"),
                        date_finish: moment(value.end).format("YYYY-MM-DD")
                      }
                    );
                  }
                }}
              />
            </div>
          </div>
          <div>
            <DataTable
              columnContentTypes={["text", "numeric", "numeric", "numeric"]}
              headings={["Funnel", "Views", "Conversion", "Revenue"]}
              rows={top_converting_campaigns.map(item => {
                const _item = [...item];
                _item[3] = default_money_format
                  .replace(/\{\{.*?\}\}/, !isNaN(_item[3]) ? _item[3].toFixed(2) : _item[3])
                  .replace(/<[^>]*>/g, "");
                return _item;
              })}
              sortable={[false, true, true, true]}
              defaultSortDirection="descending"
              initialSortColumnIndex={3}
              onSort={this.handleSort}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default TopConvertingCampaigns;
