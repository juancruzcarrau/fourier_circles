import {useEffect, useRef, useState} from "react";
import FourierService from "../services/FourierService";

const Canvas = ({canvasContainer}) => {

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isFirstDrawing, setIsFirstDrawing] = useState(true)

    const [maxFrequency, setMaxFrequency] = useState(50)
    let points = useRef([]) //Variable that holds current points' coordinates
    let drawnPoints = useRef([]) //Variable that holds coordinates of points already drawn by animation
    const [continueAnimation, setContinueAnimation] = useState(false)

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = canvasContainer.current.clientWidth * 2;
        canvas.height = canvasContainer.current.clientHeight * 2;
        canvas.style.width = `100%`;
        canvas.style.height = `100%`;
        canvas.style.borderRadius = "20px"

        const context = canvas.getContext("2d");
        context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = "black";
        context.lineWidth = 2;
        contextRef.current = context;
    }, [])

    //-----------------Initial drawing-----------------
    const startDrawing = (event) => {
        initializeBoard() //Clear board of previous drawing
        const offsetX = event.nativeEvent.offsetX; //Get xCoordinate
        const offsetY = event.nativeEvent.offsetY; //Get yCoordinate
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
        addPointToArray(offsetX, offsetY); //Sava first point
    }

    const draw = (event) => {
        if(!isDrawing) {
            return
        }

        const offsetX = event.nativeEvent.offsetX, offsetY = event.nativeEvent.offsetY; //Get coordinates
        contextRef.current.lineTo(offsetX, offsetY) ; //move pointer
        contextRef.current.stroke(); //draw line
        addPointToArray(offsetX, offsetY); //save point
        setIsFirstDrawing(false)
    }

    const finishDrawing = () => {
        contextRef.current.lineTo(points.current[0].x, points.current[0].y) //Make stroke go to starting point
        contextRef.current.stroke()
        contextRef.current.closePath()
        setIsDrawing(false)
        const constantVectors = FourierService.getConstantVectors(points.current, maxFrequency, canvasRef)
        drawFourierEpicycles(constantVectors)
    }

    const clearBoard = (context) => {
        //Board is cleared of anything drawn on it
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.strokeStyle = "black"
        points.current = []
        drawnPoints.current = []
    }

    const initializeBoard = () => {
        const context = contextRef.current;

        if(!isFirstDrawing) {
            //If there has already been a drawing, that means that the canvas has been transformed and needs to be
            //transformed back
            context.scale(1, -1);
            context.translate(-canvasRef.current.width / 4, -canvasRef.current.height / 4)
        }

        clearBoard(context);
    }

    const addPointToArray = (xCoordinate, yCoordinate) => {
        points.current.push({t: points.current.length, x: xCoordinate, y: yCoordinate})
    }

    //-----------------Fourier Epicycles-----------------
    const fourierEpicyclesInitialization = () => {
        //Canvas is transformed into cartesian system
        const context = contextRef.current
        context.translate(canvasRef.current.width / 4, canvasRef.current.height / 4)
        context.scale(1, -1);
    }

    const drawFourierEpicycles = (constantVectors) => {

        fourierEpicyclesInitialization()
        const context = contextRef.current
        const frequencies = FourierService.getFrequencies(maxFrequency)
        let currentDrawingPoint = {x: 0, y: 0}

        // for (let t = 0; true; t = t + 0.01) {
            frequencies.forEach(frequency => {
                const vector = constantVectors[frequency]
                const polar = FourierService.getPolarForm(vector)

                context.strokeStyle = "rgba(0,0,0,0.15)"
                context.beginPath();
                context.arc(currentDrawingPoint.x, currentDrawingPoint.y, polar.r, 0, 2 * Math.PI);
                context.stroke();
                context.closePath()

                context.strokeStyle = "rgba(0, 0, 0, 0.44)"
                context.beginPath()
                context.moveTo(currentDrawingPoint.x, currentDrawingPoint.y)
                currentDrawingPoint.x = currentDrawingPoint.x + vector.x
                currentDrawingPoint.y = currentDrawingPoint.y + vector.y
                context.lineTo(currentDrawingPoint.x, currentDrawingPoint.y)
                context.stroke()
                context.closePath()
            })
        //     console.log("For loop")
        // }
    }

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
        />
    );
}

export default Canvas;