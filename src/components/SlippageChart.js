import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  WhaleFriendlyAxisTick,
  whaleFriendlyFormater,
} from "../components/WhaleFriendly";

import { COLORS } from "../constants";
import { Component } from "react";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";
import poolsStore from "../stores/pools.store";

const truncate = {
  maxWidth: "200px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const expendedBoxStyle = {
  margin: "30px",
  width: "100%",
  minHeight: "420px",
  padding: "40px",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { name, value, liquidation } = Object.assign({}, payload[0].payload);
    return (
      <div className="tooltip-container">
        <div>Liquidity Depth: {whaleFriendlyFormater(value)}</div>
        <div>
          Max liquidation on worst day: {whaleFriendlyFormater(liquidation)}
        </div>
      </div>
    );
  }
};

class SlippageChart extends Component {
  render() {
    let dataSet = [this.props.data];

    if (!dataSet.length) {
      return null;
    }
    let dataMax = 0;
    dataSet.sort((a, b) => b.value - a.value);
    let valueMax = dataSet[0].value;

    dataSet.sort((a, b) => b.liquidation - a.liquidation);
    let liquidationMax = dataSet[0].liquidation;

    if (valueMax > liquidationMax) {
      dataMax = valueMax;
    } else {
      dataMax = liquidationMax;
    }

    if (dataMax < 1) {
      dataMax = 1000;
    }

    const color = mainStore.blackMode ? "white" : "black";

    const poolsData = Object.assign([], poolsStore["pools_data"] || []);
    const tab = poolsStore["tab"];
    const selectedPool = poolsData.find((p) => p.address === tab);
    const percent =
      (10000 - selectedPool["creditManagers"]["0"]["liquidationDiscount"]) /
      100;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <article style={expendedBoxStyle}>
          <ResponsiveContainer>
            <BarChart data={dataSet}>
              <XAxis dataKey="name" />
              <YAxis
                type="number"
                domain={[0, dataMax]}
                tick={<WhaleFriendlyAxisTick />}
                allowDataOverflow={true}
              />
              <Tooltip content={CustomTooltip} />
              <Legend verticalAlign="bottom" height={36} />
              <Bar name="Liquidity Depth" dataKey="value" fill={COLORS[0]} />
              <Bar
                name="Worst Day Liquidation Volume"
                dataKey="liquidation"
                fill={COLORS[16]}
              />
            </BarChart>
          </ResponsiveContainer>
        </article>
        <div
          className="box-space"
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <hgroup>
            <h1></h1>
            <p>
              Max Liquidation in a single transaction for up to {percent}%
              slippage versus the liquidation for the worst simulated day.
            </p>
          </hgroup>
        </div>
      </div>
    );
  }
}

export default observer(SlippageChart);
