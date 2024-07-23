import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import DataTable from '../src/Table';
import AggregatedTableByCrop from "./CropTable";

export default function App() {
  return <MantineProvider theme={theme}>
    <div>
        <h1 style={{textAlign:'center'}}>Data Table Example</h1>
        <DataTable />
      </div>
      <h1 style={{textAlign:'center'}}>Aggregated Data Table by Crop</h1>
        <AggregatedTableByCrop />
  </MantineProvider>;
}
