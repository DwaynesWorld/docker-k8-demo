import React from "react";
import Ring from "ringjs";
import axios from "axios";

import {
  TimeSeries,
  TimeRange,
  TimeEvent,
  Pipeline as pipeline,
  Stream,
  EventOut,
  percentile
} from "pondjs";

import {
  ChartContainer,
  ChartRow,
  Charts,
  YAxis,
  ScatterChart,
  BarChart,
  Resizable,
  Legend,
  styler
} from "react-timeseries-charts";

const sec = 1000;
const minute = 60 * sec;
const hours = 60 * minute;
const rate = 125;

class RealTimeChart extends React.Component {
  static displayName = "Demo";

  state = {
    time: new Date(),
    events: new Ring(200),
    percentile50Out: new Ring(100),
    percentile90Out: new Ring(100)
  };

  getEvents = async () => {
    const t = new Date(this.state.time.getTime() + minute);
    const timeEvent = await this.fetchNewEvent(t);

    // Raw events
    const newEvents = this.state.events;
    newEvents.push(timeEvent);
    this.setState({ time: t, events: newEvents });

    // Let our aggregators process the event
    this.stream.addEvent(timeEvent);
  };

  fetchNewEvent = async t => {
    const unix = t.getTime();
    const url = `http://localhost:81/api/events/${unix}`;
    const results = await axios.get(url);

    const timeEvent = new TimeEvent(t, results.data);
    return timeEvent;
  };

  componentDidMount() {
    this.stream = new Stream();

    pipeline()
      .from(this.stream)
      .windowBy("5m")
      .emitOn("discard")
      .aggregate({
        value: { value: percentile(90) }
      })
      .to(EventOut, event => {
        const events = this.state.percentile90Out;
        events.push(event);
        this.setState({ percentile90Out: events });
      });

    pipeline()
      .from(this.stream)
      .windowBy("5m")
      .emitOn("discard")
      .aggregate({
        value: { value: percentile(50) }
      })
      .to(EventOut, event => {
        const events = this.state.percentile50Out;
        events.push(event);
        this.setState({ percentile50Out: events });
      });

    this.interval = setInterval(() => this.getEvents(), rate);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const latestTime = `${this.state.time}`;

    const fiveMinuteStyle = {
      value: {
        normal: { fill: "#619F3A", opacity: 0.2 },
        highlight: { fill: "619F3A", opacity: 0.5 },
        selected: { fill: "619F3A", opacity: 0.5 }
      }
    };

    const scatterStyle = {
      value: {
        normal: {
          fill: "steelblue",
          opacity: 0.5
        }
      }
    };

    const eventSeries = new TimeSeries({
      name: "raw",
      events: this.state.events.toArray().sort()
    });

    const perc50Series = new TimeSeries({
      name: "five minute perc50",
      events: this.state.percentile50Out.toArray().sort()
    });

    const perc90Series = new TimeSeries({
      name: "five minute perc90",
      events: this.state.percentile90Out.toArray().sort()
    });

    const initialBeginTime = new Date(2015, 0, 1);
    const timeWindow = 3 * hours;
    let beginTime;
    const endTime = new Date(this.state.time.getTime() + minute);
    if (endTime.getTime() - timeWindow < initialBeginTime.getTime()) {
      beginTime = initialBeginTime;
    } else {
      beginTime = new Date(endTime.getTime() - timeWindow);
    }

    const timeRange = new TimeRange(beginTime, endTime);

    const dateStyle = {
      fontSize: 12,
      color: "#AAA",
      borderWidth: 1,
      borderColor: "#F4F4F4"
    };

    const style = styler([
      { key: "perc50", color: "#C5DCB7", width: 1, dashed: true },
      { key: "perc90", color: "#DFECD7", width: 2 }
    ]);

    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <Legend
              type="swatch"
              style={style}
              categories={[
                {
                  key: "perc50",
                  label: "50th Percentile",
                  style: { fill: "#C5DCB7" }
                },
                {
                  key: "perc90",
                  label: "90th Percentile",
                  style: { fill: "#DFECD7" }
                }
              ]}
            />
          </div>
          <div className="col-md-8">
            <span style={dateStyle}>{latestTime}</span>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-md-12">
            <Resizable>
              <ChartContainer timeRange={timeRange}>
                <ChartRow height="150">
                  <YAxis
                    id="y"
                    label="Value"
                    min={0}
                    max={1500}
                    width="70"
                    type="linear"
                  />
                  <Charts>
                    <BarChart
                      axis="y"
                      series={perc90Series}
                      style={fiveMinuteStyle}
                      columns={["value"]}
                    />
                    <BarChart
                      axis="y"
                      series={perc50Series}
                      style={fiveMinuteStyle}
                      columns={["value"]}
                    />
                    <ScatterChart
                      axis="y"
                      series={eventSeries}
                      style={scatterStyle}
                    />
                  </Charts>
                </ChartRow>
              </ChartContainer>
            </Resizable>
          </div>
        </div>
      </div>
    );
  }
}

export default RealTimeChart;
