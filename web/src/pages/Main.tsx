import {useEffect, useState} from "react";
import {ClipLoader} from "react-spinners";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import FileSaver from 'file-saver';

import '../style/main-screen.scss';
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {TextField} from "@mui/material";
import {VictoryContainer, VictoryPie} from "victory";
import './Details';
import {DetailProps} from "./Details";
import Result from "../state/result";
import http from "../service/http";

type MainState = Result[];

type PopupState = {
    posX: number,
    posY: number
} | null;

type MainProps = {
    setDetailedId: (p: DetailProps) => void
};

const pieColors = [
    "#003f5c",
    "#2f4b7c",
    "rgb(36.8417%, 50.6779%, 70.9798%)",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "#ffa600",
    "rgb(88.0722%, 61.1041%, 14.2051%)",
    // "rgb(56.0181%, 69.1569%, 19.4885%)",
    // "rgb(92.2526%, 38.5626%, 20.9179%)",
    // "rgb(52.8488%, 47.0624%, 70.1351%)",
    // "rgb(77.2079%, 43.1554%, 10.2387%)",
    // "rgb(100%, 75%, 0%)",
    // "rgb(36.3898%,               61.8501%,              78.2349%)",
    // "rgb(64.7624%,               37.816%,               61.4037%)",
    // "rgb(57.1589%,               58.6483%,              0%)",
    // "rgb(91.5%,                  33.25%,                21.25%)",
    // "rgb(40.082222609352647%,    52.20066643438841%,    85%)",
    // "rgb(97.28288904374106%,     62.1644452187053%,     07.336199581899142%)",
    // "rgb(73.6782672705901%,      35.8%,                 50.30266573755369%)",
    // "rgb(28.026441037696703%,    71.5%,                 42.9208932247496%)"
];

const saveFile = (results: Result[]) => {
    const data = results.reduce((prev, value, index) => {
        return prev + `\n${index},${value.entity},${value.count}`;
    }, "id,entity,count");

    FileSaver.saveAs(data, "data.csv");
}

export default function Main({ setDetailedId }: MainProps) {
    const now = new Date();

    const [startDate, setStartDate] = useState(new Date(now.getFullYear(), now.getMonth() == 0 ? 11 : now.getMonth() - 1, now.getDate()));
    const [endDate, setEndDate] = useState(now);

    const [popupVisible, setPopupVisible] = useState<PopupState>(null);

    const [stats, setStats] = useState<MainState | null>(null);

    useEffect(
        () => {
            http
                .getByDates(startDate, endDate)
                .then(res => setStats(res.data));
        },
        []
    )

    const setStart = (date: Date) => {
        const copy = stats;

        setStartDate(date);
        setStats(null);
        setTimeout(() => setStats(copy), 3000);
    };

    const setEnd = (date: Date) => {
        const copy = stats;

        setEndDate(date);
        setStats(null);
        setTimeout(() => setStats(copy), 3000);
    }

    return <div className="main-screen p-4 flex-grow-1">
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className="d-flex d-md-block data-block">
                <div className="d-inline-block mb-3 mb-md-0 mx-md-3"><DatePicker label="Start date" inputFormat="DD/MM/YYYY" onChange={(date) => setStart(date ?? new Date())} value={startDate} renderInput={(params) => <TextField {...params} />}/></div>
                <DatePicker label="End date" inputFormat="DD/MM/YYYY" onChange={(date) => setEnd(date ?? new Date())} value={endDate} renderInput={(params) => <TextField {...params} />}/>
            </div>
        </LocalizationProvider>
        { stats === null ? <div className="loader-wrapper"><ClipLoader loading={true}/></div> :
                <div className="d-flex align-items-center justify-content-center h-100"><VictoryPie containerComponent={<VictoryContainer style={{width: "auto", height: ""}}/>}
                    colorScale={pieColors}
                    data={stats}
                    events={[
                        {
                            target: "data",
                            eventHandlers: {
                                onClick: () => [{
                                    target: "data",
                                    mutation: (data) => setDetailedId({name: data.datum.entity})
                                }],
                                //@ts-ignore
                                onMouseEnter: (event) => setPopupVisible({posX: event.nativeEvent.pageX, posY: event.nativeEvent.pageY}),
                                onMouseLeave: () => setPopupVisible(null)
                            }
                        }
                    ]}
                    labels={(datum) => datum.datum.entity}
                    y={(datum) => datum.count} /></div> }
        { popupVisible === null ? <></> :
            <div className="position-absolute not-interactive popup-hint" style={{left: popupVisible.posX, top: popupVisible.posY}}>
                Click to see details
            </div> }
    </div>
}