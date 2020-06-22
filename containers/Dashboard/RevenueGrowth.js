import React, { Component } from "react";
import { Card, Icon } from "@shopify/polaris";
import { I18n } from "react-redux-i18n";
import { AnalyticsMajorMonotone } from "@shopify/polaris-icons";
import { Bar } from "react-chartjs-2";
import moment from "moment";
import "./RevenueGrowth.scss";
import DatePickerInput from "../../components/Fields/DatePickerInput";
import { getRevenueGrowth } from "../../redux/actions";

const options = {
  elements: {},
  responsive: true,
  legend: {
    // position: 'top',
    display: false
  },
  tooltips: {
    // position: 'nearest',
    caretPadding: 0,
    callbacks: {
      title: tooltipItem => {
        return moment(tooltipItem[0].xLabel).format("MMM D, YYYY");
      }
    }
  },
  title: {
    display: false
  },
  layout: {
    padding: {
      right: 5
    }
  },
  scales: {
    xAxes: [
      {
        type: "time"
        // time: {
        //   unit: 'day',
        // },
        // ticks: {
        //   source: 'data',
        // },
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          stepSize: 250
        }
      }
    ]
  }
};

class RevenueGrowth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: {
        start: moment()
          .subtract(3, "months")
          .toDate(),
        end: moment().toDate()
      },
      revenue_growth: []
    };
  }

  async componentDidMount() {
    const data = await getRevenueGrowth({
      date_start: moment()
        .subtract(3, "months")
        .format("YYYY-MM-DD"),
      date_finish: moment().format("YYYY-MM-DD")
    });
    this.setState({ revenue_growth: data });
  }

  render() {
    const { revenue_growth, date } = this.state;
    const { default_money_format } = this.props;

    return (
      <Card
        title={
          <div className="Icon-card-title Polaris-Heading">
            <Icon source={AnalyticsMajorMonotone} color="inkLighter" />{" "}
            {I18n.t("Revenue growth")}
          </div>
        }
        sectioned
      >
        <div className="RevenueGrowth-content">
          <div className="header">
            <h2>{I18n.t("See Ultimate Upsell revenue growth")}</h2>
            <div className="date">
              <DatePickerInput
                input={{
                  value: date,
                  onChange: async value => {
                    this.setState({
                      date: value,
                      revenue_growth: await getRevenueGrowth({
                        date_start: moment(value.start).format("YYYY-MM-DD"),
                        date_finish: moment(value.end).format("YYYY-MM-DD")
                      })
                    });
                    amplitude.logEvent("click-date_picker_revenue_growth", {
                      date_start: moment(value.start).format("YYYY-MM-DD"),
                      date_finish: moment(value.end).format("YYYY-MM-DD")
                    });
                  }
                }}
              />
            </div>
          </div>
          <div>
            <Bar
              data={{
                datasets: [
                  {
                    backgroundColor: "#4F5DBA",
                    hoverBackgroundColor: "#4F5DBA",
                    data: revenue_growth.map(item => ({
                      x: moment(item.date).toDate(),
                      y: item.total.toFixed(2)
                    }))
                  }
                ]
              }}
              options={options}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default RevenueGrowth;
