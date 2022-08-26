import React, {useState} from 'react';
import Main from "./pages/Main";
import Details, {DetailProps} from "./pages/Details";

function App() {
    const [detailedId, setDetailedId] = useState<DetailProps>({name: null});

    return (
        <div className="d-flex flex-column flex-lg-row w-100 h-100">
            <Main setDetailedId={setDetailedId}/>
            <Details {...detailedId}/>
        </div>
    );
}

export default App;
