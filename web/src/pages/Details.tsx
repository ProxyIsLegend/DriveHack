import {VictoryBar, VictoryChart, VictoryTheme, VictoryZoomContainer, VictoryLabel, VictoryAxis} from "victory";
import moment from "moment";

import "../style/details.scss";
import {useEffect, useState} from "react";
import {ClipLoader} from "react-spinners";
import http from "../service/http";
import Article from "../state/article";

type DetailsState = Article[];

export type DetailProps = {
    name: string | null
};

export default function Details({ name }: DetailProps) {
    const [stats, setStats] = useState<DetailsState | null>(null);

    useEffect(
        () => {
            if (name != null) {
                setStats(null);
                http.getByEntity(name).then(res => {
                    setStats(res.data);
                });
            }
        },
        [name]
    );

    if (name == null) {
        return <div className="d-flex flex-grow-1 align-items-center justify-content-center">
            Click on the pie to see details
        </div>;
    }

    return <div className="h-100 flex-grow-1">
        <div className="text-center pt-4 p-2 details-header">{`Details for "${name}"`}</div>

        <div className="h-100 d-flex align-items-center justify-content-center">
            {
                (() => {
                    if (stats == null) {
                        return <ClipLoader loading={true}/>;
                    }

                    const minDate = moment(stats[0].date), maxDate = moment(stats[stats.length - 1].date);

                    const accumulated = [];

                    const start = moment(minDate).subtract(1, 'days');

                    while (!start.add(1, 'days').isAfter(maxDate)) {
                        accumulated.push({
                            date: start.format('DD.MM.YYYY'),
                            count: 0,
                        });
                    }

                    for (const record of stats) {
                        const date = moment(record.date);

                        accumulated[date.diff(minDate, 'days')].count += 1;
                    }

                    console.log(accumulated);

                    return <VictoryChart containerComponent={<VictoryZoomContainer style={{width: "100%", height: "70vh"}}/>} theme={VictoryTheme.material} domainPadding={{ x: 20 }}>
                        <VictoryBar data={accumulated} x={(datum) => {
                            console.log(datum);

                            return `${datum.date.substring(0, 2)}-${datum.date.substring(3, 5)}`;
                        }} y={(datum) => datum.count}></VictoryBar>
                        <VictoryAxis dependentAxis/>
                        <VictoryAxis tickLabelComponent={<VictoryLabel angle={-90} verticalAnchor="end" y={330} />} crossAxis/>
                    </VictoryChart>;
                })()
            }
        </div>
    </div>;
}