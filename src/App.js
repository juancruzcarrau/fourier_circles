import './App.css';
import Canvas from "./components/Canvas";
import './App.css'
import {useRef} from "react";
import {Button} from "@mui/material";


const App = () => {

    const canvasContainer = useRef(null)

    return(
        <div style={{display: "flex", height: "100%", margin: "10px"}}>
            <div className="item" style={{flexBasis: "75%"}} ref={canvasContainer}>
                <Canvas canvasContainer={canvasContainer}/>
            </div>
            <div className="item" style={{flexBasis: "25%"}}>
            </div>
        </div>
    )
}

export default App;
