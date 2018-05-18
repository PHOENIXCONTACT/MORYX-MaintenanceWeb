import * as chartjs from "chart.js";
import * as React from "react";
import { ChartData, Line } from "react-chartjs-2";
import SystemLoadSample from "../../common/models/SystemLoadSample";

interface ICPUMemoryPropsModel {
    Samples: SystemLoadSample[];
}

interface ICPUMemoryStateModel {
    chartData: any;
}

export class CPUMemoryChart extends React.Component<ICPUMemoryPropsModel, ICPUMemoryStateModel> {
    constructor(props: ICPUMemoryPropsModel) {
        super(props);
        this.state = {
            chartData: this.createChartData(),
        };
    }

    public componentDidMount() {
        this.updateChartData(this.props);
    }

    public componentWillReceiveProps(nextProps: ICPUMemoryPropsModel) {
        this.updateChartData(nextProps);
    }

    public updateChartData(nextProps: ICPUMemoryPropsModel) {
        const chartData = this.createChartData();
        nextProps.Samples.forEach((sample) => {
            chartData.labels.push(sample.Date);
            chartData.datasets[0].data.push(sample.CPULoad);
            chartData.datasets[1].data.push(sample.SystemMemoryLoad);
        });

        this.setState({chartData});
    }

    public createChartData(): any {
        const chartData: ChartData<chartjs.ChartData> = {
            labels: [],
            datasets:
            [
                {
                    label: "CPU load (%)",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(218, 165, 32, 0.5)",
                    data: [],
                },
                {
                    label: "Used memory (%)",
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(0, 0, 255, 0.5)",
                    data: [],
                },
            ],
        };
        return chartData;
    }

    public render() {
        return (
            <Line  data={this.state.chartData} />
        );
    }
}
