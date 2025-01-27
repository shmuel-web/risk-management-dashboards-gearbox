import Box from "../components/Box";
import BoxGrid from "../components/BoxGrid";
import { Component } from "react";
import PieChart from "../components/PieChart";
import mainStore from "../stores/main.store";
import { observer } from "mobx-react";

class OverviewPieCharts extends Component {
  render() {
    const overviewData = this.props.data;
    const json_time = this.props.time;
    const loading = mainStore["overview_loading"]; // TODO

    return (
      <BoxGrid>
        <Box loading={loading} height={590} time={json_time}>
          <h6 style={{ margin: 0 }}>Collateral</h6>
          {!loading && <PieChart data={overviewData.collateralGraphData} />}
        </Box>
        {/* <Box loading={loading} height={450} time={json_time}>
          <h6 style={{margin: 0}}>Debt</h6>
          {!loading && <PieChart data={data} dataKey={'total_debt'}/>}
        </Box> */}
      </BoxGrid>
    );
  }
}

export default observer(OverviewPieCharts);
